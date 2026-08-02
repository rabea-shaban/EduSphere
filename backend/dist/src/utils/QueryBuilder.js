"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryBuilder = void 0;
class QueryBuilder {
    modelQuery;
    query;
    filterQuery = {};
    constructor(modelQuery, query) {
        this.modelQuery = modelQuery;
        this.query = query || {};
    }
    /**
     * Apply keyword search across specified searchable fields
     */
    search(searchableFields) {
        const searchTerm = this.query.search || this.query.q || this.query.keyword;
        if (searchTerm && searchableFields.length > 0) {
            const searchRegex = new RegExp(String(searchTerm).trim(), 'i');
            const searchConditions = searchableFields.map((field) => ({
                [field]: searchRegex,
            }));
            this.filterQuery.$or = searchConditions;
        }
        return this;
    }
    /**
     * Apply whitelist filters (strips query parameters not in whitelist or reserved keywords)
     */
    filter(filterWhitelist = []) {
        const queryObj = { ...this.query };
        const excludedFields = ['page', 'limit', 'sort', 'search', 'q', 'keyword', 'fields', 'dateFrom', 'dateTo', 'deleted', 'permanent'];
        excludedFields.forEach((field) => delete queryObj[field]);
        filterWhitelist.forEach((field) => {
            if (queryObj[field] !== undefined && queryObj[field] !== null && queryObj[field] !== '' && queryObj[field] !== 'all') {
                let val = queryObj[field];
                if (val === 'true')
                    val = true;
                if (val === 'false')
                    val = false;
                this.filterQuery[field] = val;
            }
        });
        return this;
    }
    /**
     * Apply date range filtering (dateFrom, dateTo or predefined shortcuts)
     */
    dateRange(dateField = 'createdAt') {
        const { dateFrom, dateTo, dateShortcut } = this.query;
        const dateFilter = {};
        if (dateFrom) {
            dateFilter.$gte = new Date(dateFrom);
        }
        if (dateTo) {
            const endOfDay = new Date(dateTo);
            endOfDay.setHours(23, 59, 59, 999);
            dateFilter.$lte = endOfDay;
        }
        if (dateShortcut) {
            const now = new Date();
            if (dateShortcut === 'today') {
                const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                dateFilter.$gte = start;
            }
            else if (dateShortcut === 'yesterday') {
                const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
                const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 59, 59, 999);
                dateFilter.$gte = start;
                dateFilter.$lte = end;
            }
            else if (dateShortcut === 'last7days') {
                const start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                dateFilter.$gte = start;
            }
            else if (dateShortcut === 'last30days') {
                const start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                dateFilter.$gte = start;
            }
            else if (dateShortcut === 'thisMonth') {
                const start = new Date(now.getFullYear(), now.getMonth(), 1);
                dateFilter.$gte = start;
            }
        }
        if (Object.keys(dateFilter).length > 0) {
            this.filterQuery[dateField] = dateFilter;
        }
        return this;
    }
    /**
     * Apply numeric range filtering (e.g., minPrice, maxPrice)
     */
    range(field, minKey, maxKey) {
        const minVal = this.query[minKey];
        const maxVal = this.query[maxKey];
        const rangeFilter = {};
        if (minVal !== undefined && minVal !== '')
            rangeFilter.$gte = Number(minVal);
        if (maxVal !== undefined && maxVal !== '')
            rangeFilter.$lte = Number(maxVal);
        if (Object.keys(rangeFilter).length > 0) {
            this.filterQuery[field] = rangeFilter;
        }
        return this;
    }
    /**
     * Apply whitelist sorting with alias mappings
     */
    sort(sortWhitelist = [], defaultSort = { createdAt: -1 }) {
        const sortParam = this.query.sort;
        let sortBy = defaultSort;
        if (sortParam) {
            const aliasMap = {
                newest: { createdAt: -1 },
                oldest: { createdAt: 1 },
                highest_rating: { rating: -1, averageRating: -1 },
                lowest_rating: { rating: 1, averageRating: 1 },
                highest_revenue: { earnings: -1, totalRevenue: -1 },
                most_enrolled: { enrolledStudentsCount: -1, totalStudents: -1 },
                name_asc: { title: 1, name: 1, originalName: 1 },
                name_desc: { title: -1, name: -1, originalName: -1 },
                recently_updated: { updatedAt: -1 },
            };
            if (aliasMap[sortParam]) {
                sortBy = aliasMap[sortParam];
            }
            else {
                const sortParts = String(sortParam).split(':');
                const field = sortParts[0].replace('-', '');
                const order = sortParts[1] === 'asc' || !sortParam.startsWith('-') ? 1 : -1;
                if (sortWhitelist.length === 0 || sortWhitelist.includes(field)) {
                    sortBy = { [field]: order };
                }
            }
        }
        this.modelQuery = this.modelQuery.sort(sortBy);
        return this;
    }
    /**
     * Apply pagination
     */
    paginate(defaultLimit = 20) {
        const page = Math.max(1, parseInt(this.query.page || '1', 10));
        const limit = Math.min(100, Math.max(1, parseInt(this.query.limit || String(defaultLimit), 10)));
        const skip = (page - 1) * limit;
        this.modelQuery = this.modelQuery.skip(skip).limit(limit);
        return this;
    }
    /**
     * Execute query and return data with pagination metadata
     */
    async execute(model) {
        this.modelQuery = this.modelQuery.find(this.filterQuery);
        const page = Math.max(1, parseInt(this.query.page || '1', 10));
        const limit = Math.min(100, Math.max(1, parseInt(this.query.limit || '20', 10)));
        const [data, total] = await Promise.all([
            this.modelQuery.lean(),
            model.countDocuments(this.filterQuery),
        ]);
        const totalPages = Math.ceil(total / limit) || 1;
        return {
            data: data,
            pagination: {
                total,
                page,
                limit,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
        };
    }
}
exports.QueryBuilder = QueryBuilder;
exports.default = QueryBuilder;
