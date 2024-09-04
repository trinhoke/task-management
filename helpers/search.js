const allowedSearchFields = ['title', 'description', 'status'];

module.exports.search = (req) => {
    let find = {};
    if(req.query.searchKey && req.query.searchValue) {
        if (allowedSearchFields.includes(req.query.searchKey)) {
            find[req.query.searchKey] = {
                $regex: req.query.searchValue,
                $options: "i"
            }
        }
    }
    return find;
};