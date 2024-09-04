module.exports.sort = (req) => {
    let sort = {
        createdAt: -1
    };
    if(req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    }
    return sort;
}