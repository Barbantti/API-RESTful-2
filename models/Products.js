const mongoose = require('mongoose')

const Products = mongoose.model('Products', {

    ProductName: String,

    ProductPrice: Number,

    ProductApproved: Boolean,

    EmployerName: String,

    EmployerSalary: Number,

    EmployerApplicationApproved: Boolean

})

module.exports = Products