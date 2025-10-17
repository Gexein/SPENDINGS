const sequelize = require('../db')
const { DataTypes } = require('sequelize')

const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, defaultValue: 'USER' },
    name: { type: DataTypes.STRING, allowNull: false },
    img: { type: DataTypes.STRING, defaultValue: 'default-avatar.jpg' }
})

const Spending = sequelize.define('spending', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    amount: { type: DataTypes.INTEGER, allowNull: false },
    purchase_date: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
})

const Category = sequelize.define('category', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    color: { type: DataTypes.STRING, defaultValue: '#FFF' }
})

User.hasMany(Spending)
Spending.belongsTo(User)

User.hasMany(Category)
Category.belongsTo(User)

Category.hasMany(Spending, {
    foreignKey: {
        name: 'categoryId',
        allowNull: true
    }
})
Spending.belongsTo(Category, {
    foreignKey: {
        name: 'categoryId',
        allowNull: true
    }
})


module.exports = { User, Spending, Category }

