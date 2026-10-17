const asyncHandler = require('express-async-handler')
const Ticket = require('../models/ticketModel')
const Note = require('../models/noteModel')

const PRIORITY_ORDER = ['urgent', 'high', 'medium', 'low']

const toRows = (rows, fallback) =>
  rows
    .map((r) => ({ label: r._id || fallback, count: r.count }))
    .sort((a, b) => b.count - a.count)

const groupCount = (field) => [
  { $group: { _id: `$${field}`, count: { $sum: 1 } } },
]

// @route GET /api/stats   (staff only)
const getStats = asyncHandler(async (req, res) => {
  // Start of the day 6 days ago (UTC), so we get 7 days including today
  const since = new Date()
  since.setUTCHours(0, 0, 0, 0)
  since.setUTCDate(since.getUTCDate() - 6)

  const [facets] = await Ticket.aggregate([
    {
      $facet: {
        status: groupCount('status'),
        priority: [{ $match: { status: { $ne: 'closed' } } }, ...groupCount('priority')],
        product: groupCount('product'),
        category: groupCount('category'),
        daily: [
          { $match: { createdAt: { $gte: since } } },
          {
            $group: {
              _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
              count: { $sum: 1 },
            },
          },
        ],
        unassigned: [
          { $match: { status: { $ne: 'closed' }, assignedTo: null } },
          { $count: 'count' },
        ],
        mine: [
          { $match: { status: { $ne: 'closed' }, assignedTo: req.user._id } },
          { $count: 'count' },
        ],
      },
    },
  ])

  // Average time from ticket creation to the first staff reply
  const [reply] = await Note.aggregate([
    { $match: { isStaff: true } },
    { $group: { _id: '$ticket', firstReply: { $min: '$createdAt' } } },
    {
      $lookup: {
        from: Ticket.collection.name,
        localField: '_id',
        foreignField: '_id',
        as: 'ticket',
      },
    },
    { $unwind: '$ticket' },
    {
      $group: {
        _id: null,
        avgMs: { $avg: { $subtract: ['$firstReply', '$ticket.createdAt'] } },
      },
    },
  ])

  const statusCounts = Object.fromEntries(facets.status.map((s) => [s._id, s.count]))
  const totals = {
    new: statusCounts.new || 0,
    open: statusCounts.open || 0,
    closed: statusCounts.closed || 0,
  }
  totals.all = totals.new + totals.open + totals.closed

  const priorityMap = Object.fromEntries(facets.priority.map((p) => [p._id || 'medium', p.count]))
  const byPriority = PRIORITY_ORDER.map((p) => ({ label: p, count: priorityMap[p] || 0 }))

  // Fill in days with zero tickets
  const dailyMap = Object.fromEntries(facets.daily.map((d) => [d._id, d.count]))
  const last7Days = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(since)
    d.setUTCDate(since.getUTCDate() + i)
    const key = d.toISOString().slice(0, 10)
    last7Days.push({ date: key, count: dailyMap[key] || 0 })
  }

  res.status(200).json({
    totals,
    unassigned: facets.unassigned[0]?.count || 0,
    assignedToMe: facets.mine[0]?.count || 0,
    avgFirstResponseHours: reply ? Number((reply.avgMs / 3600000).toFixed(2)) : null,
    byPriority,
    byProduct: toRows(facets.product, 'Unknown'),
    byCategory: toRows(facets.category, 'Other'),
    last7Days,
  })
})

module.exports = { getStats }