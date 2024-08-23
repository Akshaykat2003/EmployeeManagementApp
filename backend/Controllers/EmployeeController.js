const EmployeeModel = require("../Models/EmployeeModel");

// Create Employee
const createEmployee = async (req, res) => {
    try {
        const { email, name, phone, department, salary } = req.body;

        // Validate input
        if (!email || !name || !phone || !department || !salary) {
            return res.status(400).json({
                message: 'All fields are required',
                success: false
            });
        }

        const existingEmployee = await EmployeeModel.findOne({ email });

        if (existingEmployee) {
            return res.status(409).json({
                message: 'Employee with this email already exists',
                success: false
            });
        }

        const profileImage = req.file ? req.file.path : null;
        const emp = new EmployeeModel({ ...req.body, profileImage });

        await emp.save();
        res.status(201).json({
            message: 'Employee Created Successfully',
            success: true,
            data: emp
        });
    } catch (err) {
        console.error('Error creating employee:', err);
        res.status(500).json({
            message: 'Internal Server Error',
            success: false,
            error: err.message
        });
    }
};

// Get All Employees with Pagination
const getAllEmployees = async (req, res) => {
    try {
        let { page, limit, search } = req.query;
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        const skip = (page - 1) * limit;

        let searchCriteria = {};
        if (search) {
            searchCriteria.name = { $regex: search, $options: 'i' }; // Case insensitive search
        }

        const totalEmployees = await EmployeeModel.countDocuments(searchCriteria);
        const emps = await EmployeeModel.find(searchCriteria)
            .skip(skip)
            .limit(limit)
            .sort({ updatedAt: -1 });

        const totalPages = Math.ceil(totalEmployees / limit);

        res.status(200).json({
            message: 'All Employees Fetched Successfully',
            success: true,
            data: {
                employees: emps,
                pagination: {
                    totalEmployees,
                    currentPage: page,
                    totalPages,
                    pageSize: limit
                }
            }
        });
    } catch (err) {
        console.error('Error fetching employees:', err);
        res.status(500).json({
            message: 'Internal Server Error',
            success: false,
            error: err.message
        });
    }
};

// Get Employee by ID
const getEmployeeById = async (req, res) => {
    try {
        const id = req.params.id;
        const emp = await EmployeeModel.findById(id);

        if (!emp) {
            return res.status(404).json({
                message: 'Employee not found',
                success: false
            });
        }

        res.status(200).json({
            message: 'Employee Details Fetched Successfully',
            success: true,
            data: emp
        });
    } catch (err) {
        console.error('Error fetching employee by ID:', err);
        res.status(500).json({
            message: 'Internal Server Error',
            success: false,
            error: err.message
        });
    }
};

// Delete Employee by ID
const deleteEmployeeById = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await EmployeeModel.deleteOne({ _id: id });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                message: 'Employee not found',
                success: false
            });
        }

        res.status(200).json({
            message: 'Employee Deleted Successfully',
            success: true
        });
    } catch (err) {
        console.error('Error deleting employee by ID:', err);
        res.status(500).json({
            message: 'Internal Server Error',
            success: false,
            error: err.message
        });
    }
};

// Update Employee by ID
const updateEmployeeById = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, department, salary } = req.body;

        // Validate input
        if (!email || !name || !phone || !department || !salary) {
            return res.status(400).json({
                message: 'All fields are required',
                success: false
            });
        }

        let updateData = { name, email, phone, department, salary, updatedAt: new Date() };

        if (req.file) {
            updateData.profileImage = req.file.path;
        }

        const updatedEmployee = await EmployeeModel.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedEmployee) {
            return res.status(404).json({
                message: 'Employee not found',
                success: false
            });
        }

        res.status(200).json({
            message: 'Employee Updated Successfully',
            success: true,
            data: updatedEmployee
        });
    } catch (err) {
        console.error('Error updating employee by ID:', err);
        res.status(500).json({
            message: 'Internal Server Error',
            success: false,
            error: err.message
        });
    }
};

module.exports = {
    createEmployee,
    getAllEmployees,
    getEmployeeById,
    deleteEmployeeById,
    updateEmployeeById
};
