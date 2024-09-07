const Task = require("../models/task.model");
const searchHelper = require("../helpers/search");
const paginationHelper = require("../helpers/pagination");
const sortHelper = require("../helpers/sort");
// [GET] /api/v1/task
module.exports.index = async (req, res) => {
    try {
        let find = {
            deleted: false,
            $or: [
                { createdBy: req.user._id },
                { participants: req.user._id }
            ]
        };
    // filter status
        if (req.query.status) {
            find.status = req.query.status;
        }
    // filter search
       find = {
            ...find,
            ...searchHelper.search(req)
       }
    // filter sort  
        const sort = sortHelper.sort(req);

    // pagination
        const { limit, skip } = paginationHelper.pagination(req);   
    
        const tasks = await Task
            .find(find)
            .sort(sort)
            .skip(skip)
            .limit(limit);

        res.json({
            code: 200,
            message: "Get tasks successfully",
            tasks: tasks
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// [GET] /api/v1/task/detail/:id
module.exports.detail = async (req, res) => {
    const id = req.params.id;
    try {
        const task = await Task.findById(id);
        res.json(task);
    } catch (error) {
        res.status(404).json({ 
            code: 404,
            error: error.message,
            message: "Not found task"
        });
    }
}

// [POST] /api/v1/task/create
module.exports.create = async (req, res) => {
   try {
    const objectTask = {
        ...req.body,
        createdBy: req.user._id
    }   
     const task = await Task.create(objectTask);
     res.status(201).json({
        code: 201,
        message: "Create task successfully",
        task: task
     });
   } catch (error) {
        res.status(500).json({
            code: 500,
            error: error.message,
            message: "Failed to create task"
        });
   }
};

// [PATCH] /api/v1/task/update/:id
module.exports.update = async (req, res) => {
    const id = req.params.id;
    try {
        await Task.updateOne({_id: id}, req.body);  
        res.json({
            code: 200,
            message: "Update task successfully"
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            error: error.message,
            message: "Failed to update task"
        });
    }
};

// [DELETE] /api/v1/task/delete/:id
module.exports.delete = async (req, res) => {
    const id = req.params.id;
    try {
        await Task.updateOne({_id: id}, {deleted: true});
        res.json({
            code: 200,
            message: "Delete task successfully"
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            error: error.message,
            message: "Failed to delete task"
        });     
    }   
};

// [PATCH] /api/v1/task/update-status/:id
module.exports.updateStatus = async (req, res) => {
    const id = req.params.id;
    try {
        await Task.updateOne({_id: id}, {status: req.body.status});
        res.json({
            code: 200,
            message: "Update status task successfully"
        }); 
    } catch (error) {
        res.status(500).json({
            code: 500,
            error: error.message,
            message: "Failed to update status task"
        });
    }
}

// [PATCH] /api/v1/task/update-multiple
module.exports.updateMultiple = async (req, res) => {
    try {
        const { ids, keyUpdate, valueUpdate } = req.body;   
        await Task.updateMany({_id: ids}, {[keyUpdate]: valueUpdate});
        res.json({
            code: 200,
            message: "Update multiple task successfully"
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            error: error.message,
            message: "Failed to update multiple task"
        });
    }
}   

