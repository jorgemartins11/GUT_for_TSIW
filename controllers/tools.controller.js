// Get database info
const db = require("../models/db.js");

// Call database tables
const Tools = db.tools;
const Comments = db.comments;
const ToolComments = db.tool_comments;
const UserToolLike = db.user_tool_like;
const Subjects = db.subjects;

// Function used to get all tools
exports.getAllTools = (req, res) => {
    Tools.findAll()
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving tools."
            });
        })
}

// Function used to get one tool
exports.getOneTool = (req, res) => {
    Tools.findOne({
            where: {
                tool_id: req.params.toolId
            }
        })
        .then(data => {
            if (data === null) {
                res.status(200).json({
                    message: `Tool with id: ${req.params.toolId} doesn't exist!`
                });
                return;
            }
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving tool."
            });
        })
}

// Function used to create a tool
exports.createTool = (req, res) => {
    Tools.create({
            tool_name: req.body.tool_name,
            toll_desc: req.body.tool_desc,
            tool_state_id: 1
        })
        .then(data => {
            res.status(201).json({
                message: "New Tool created.",
                location: "/tools/" + data.tool_id
            });

        })
        .catch(err => {
            if (err.name === 'SequelizeValidationError')
                res.status(400).json({
                    message: err.errors[0].message
                });
            else
                res.status(500).json({
                    message: err.message || "Some error occurred while creating the Tool."
                });
        });
}

// Function used to update a tool
exports.updateTool = (req, res) => {
    Tools.update({
            tool_name: req.body.tool_name,
            toll_desc: req.body.tool_desc,
            tool_state_id: req.body.tool_state_id
        }, {
            where: {
                tool_id: req.params.toolId
            }
        })
        .then(data => {
            if (data[0] === 0) {
                res.status(200).json({
                    message: "No Tool was found with this id."
                })
                return;
            }
            res.status(200).json({
                message: "Tool updated with success!"
            })
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error ocurred while updating Tool."
            })
        });
}

// Function used to delete a tool
exports.deleteTool = (req, res) => {
    Tools.destroy({
            where: {
                tool_id: req.params.toolId
            }
        })
        .then(num => {
            if (num == 0) {
                res.status(200).json({
                    message: `No Tool with id: ${req.params.toolId} was found on the database.`
                });
                return;
            }
            res.status(200).json({
                message: "Tool deleted with success."
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || 'Some error ocurred while trying to delete Tool.'
            })
        })
}

// Function used to create a comment
exports.createComment = (req, res) => {
    Comments.create({
            comment_desc: req.body.comment
        })
        .then(data => {
            ToolComments.create({
                    tool_id: req.params.toolId,
                    comment_id: data.comment_id,
                    user_id: req.loggedUserId
                })
                .then(data2 => {
                    res.status(201).json({
                        data,
                        data2
                    });
                    return;
                })
                .catch(err => {
                    if (err.name === 'SequelizeValidationError')
                        res.status(400).json({
                            message: err.errors[0].message
                        });
                    else
                        res.status(500).json({
                            message: err.message || "Some error occurred while creating the Comment."
                        });
                });
        })
        .catch(err => {
            if (err.name === 'SequelizeValidationError')
                res.status(400).json({
                    message: err.errors[0].message
                });
            else
                res.status(500).json({
                    message: err.message || "Some error occurred while creating the Comment."
                });
        });
};

// Function user for a user to give a like/deslike to a tool
exports.leaveLike = (req, res) => {
    UserToolLike.findOne({
            where: {
                user_id: req.loggedUserId,
                tool_id: req.params.toolId
            }
        })
        .then(data => {
            if (data === null) {
                UserToolLike.create({
                        user_id: req.loggedUserId,
                        tool_id: req.params.toolId,
                        like_desc: req.body.like
                    })
                    .then(data2 => {
                        res.status(200).json(data2);
                    })
                    .catch(err => {
                        if (err.name === 'SequelizeValidationError')
                            res.status(400).json({
                                message: err.errors[0].message
                            });
                        else
                            res.status(500).json({
                                message: err.message || "Some error occurred while giving a like/deslike."
                            });
                    });
            }
            res.status(200).json({
                message: "Like/Deslike already given!"
            })
        })
        .catch(err => {
            if (err.name === 'SequelizeValidationError')
                res.status(400).json({
                    message: err.errors[0].message
                });
            else
                res.status(500).json({
                    message: err.message || "Some error occurred while giving a like/deslike."
                });
        });
};

// Function used to get all comments
exports.getComments = (req, res) => {
    Comments.findAll()
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Comments."
            });
        })
}

// Function used to delete a comment
exports.deleteComment = (req, res) => {
    ToolComments.destroy({
            where: {
                comment_id: req.params.commentId
            }
        })
        .then(num => {
            if (num != 0) {
                Comments.destroy({
                    where: {
                        comment_id: req.params.commentId
                    }
                }).then(
                    res.status(200).json({message: "Comment deleted with sucess!"})
                )
                return;
            }
            res.status(200).json({
                message: `No Comment with id: ${req.params.commentId} was found on the database.`
            });
        }
        )
        .catch(err => {
            res.status(500).send({
                message: err.message || 'Some error ocurred while trying to delete Comment.'
            })
        })
}

// Function used to get all subjects
exports.getAllSubjects = (req, res) => {
    Subjects.findAll()
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Subjects."
            });
        })
}

// Function used to create a subject
exports.createSubject = async (req, res) => {
    let sub = await Subjects.findOne({where: {subject_desc: req.body.subject_desc}})
    if (sub === null) {
        Subjects.create({
            subject_desc: req.body.subject_desc,
            subject_name: req.body.subject_name
        })
        .then(data => {
            res.status(201).json({
                message: "New Subject created.",
                location: "/subjects/" + data.subject_id
            });
    
        })
        .catch(err => {
            if (err.name === 'SequelizeValidationError')
                res.status(400).json({
                    message: err.errors[0].message
                });
            else
                res.status(500).json({
                    message: err.message || "Some error occurred while creating the Subject."
                });
        });
    } else {
        res.status(200).json({message: "Subject already created"})
    }
    
}

// Function used to delete a subject
exports.deleteSubject = (req, res) => {
    Subjects.destroy({
        where: {
            subject_id: req.params.subjectId
        }
    })
    .then(num => {
        if (num != 0) {
            res.status(200).json({
                message: "Subject deleted with success"
            })
            return;
        }
        res.status(200).json({
            message: `No Subject with id: ${req.params.subjectId} was found on the database.`
        });
    }
    )
    .catch(err => {
        res.status(500).send({
            message: err.message || 'Some error ocurred while trying to delete Subject.'
        })
    })
}