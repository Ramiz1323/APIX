const User = require('../users/user.model.js');
const Product = require('../products/product.model.js');
const Category = require('../categories/category.model.js');
const Order = require('../orders/order.model.js');
const Post = require('../posts/post.model.js');
const Comment = require('../comments/comment.model.js');

async function getOverviewStats() {
    const [
        totalUsers,
        totalProducts,
        totalCategories,
        totalOrders,
        totalPosts,
        totalComments,
        revenueAggregation,
        ordersByStatus,
    ] = await Promise.all([
        User.countDocuments(),
        Product.countDocuments(),
        Category.countDocuments(),
        Order.countDocuments(),
        Post.countDocuments(),
        Comment.countDocuments(),
        Order.aggregate([
            { $match: { status: { $ne: 'CANCELLED' } } },
            { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } },
        ]),
        Order.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } },
        ]),
    ]);

    const totalRevenue =
        revenueAggregation.length > 0 ? revenueAggregation[0].totalRevenue : 0;

    const formattedOrdersByStatus = {
        PENDING: 0,
        PROCESSING: 0,
        SHIPPED: 0,
        DELIVERED: 0,
        CANCELLED: 0,
    };

    ordersByStatus.forEach((item) => {
        if (item._id && formattedOrdersByStatus[item._id] !== undefined) {
            formattedOrdersByStatus[item._id] = item.count;
        }
    });

    return {
        users: totalUsers,
        products: totalProducts,
        categories: totalCategories,
        orders: totalOrders,
        posts: totalPosts,
        comments: totalComments,
        revenue: totalRevenue,
        ordersBreakdown: formattedOrdersByStatus,
    };
}

module.exports = {
    getOverviewStats,
};
