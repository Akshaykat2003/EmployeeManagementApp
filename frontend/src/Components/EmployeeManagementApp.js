import React, { useEffect, useState } from 'react';
import EmployeeTable from './EmployeeTable';
import AddEmployee from './AddEmployee';
import { GetAllEmployees } from '../api';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EmployeeManagementApp = () => {
    const [showModal, setShowModal] = useState(false);
    const [employeeObj, setEmployeeObj] = useState(null)
    const [employeesData, setEmployeesData] = useState({
        employees: [],
        pagination: {
            currentPage: 1,
            pageSize: 5,
            totalEmployees: 0,
            totalPages: 0
        }
    });

    const fetchEmployees = async (search = '', page = 1, limit = 5) => {
        try {
            const data = await GetAllEmployees(search, page, limit);
            setEmployeesData(data);
        } catch (err) {
            alert('Error', err);
        }
    }

    useEffect(() => {
        fetchEmployees();
    }, [])

    const handleSearch = (e) => {
        fetchEmployees(e.target.value)
    }

    const handleUpdateEmployee = async (emp) => {
        setEmployeeObj(emp);
        setShowModal(true);
    }

    return (
        <div className='container py-4'>
            <h1 className='text-center mb-4'>Employee Management App</h1>
            <div className='card shadow-sm'>
                <div className='card-body'>
                    <div className='d-flex justify-content-between mb-3'>
                        <button
                            className='btn btn-primary'
                            onClick={() => setShowModal(true)}
                        >
                            Add Employee
                        </button>
                        <input
                            onChange={handleSearch}
                            type="text"
                            placeholder="Search Employees..."
                            className='form-control w-50'
                        />
                    </div>
                    <EmployeeTable
                        employees={employeesData.employees}
                        pagination={employeesData.pagination}
                        fetchEmployees={fetchEmployees}
                        handleUpdateEmployee={handleUpdateEmployee}
                    />
                </div>
            </div>
            <AddEmployee
                fetchEmployees={fetchEmployees}
                showModal={showModal}
                setShowModal={setShowModal}
                employeeObj={employeeObj}
            />
            <ToastContainer
                position='top-right'
                autoClose={3000}
                hideProgressBar={false}
                className='toast-container'
            />
        </div>
    );
};

export default EmployeeManagementApp;
