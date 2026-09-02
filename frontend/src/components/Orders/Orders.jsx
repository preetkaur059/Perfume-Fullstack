import React, { useContext, useState, useEffect } from "react";
import { FaBoxOpen, FaTruck, FaCheckCircle } from "react-icons/fa";
import { StoreContext } from "../../context/StoreContext";
import Heading from "../Heading/Heading";

const Orders = () => {

  const { orderTotal } = useContext(StoreContext);

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const savedOrders =
      JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(savedOrders);
  }, []);

  const getStatusIcon = (status) => {
    if (status === "Processing")
      return <FaBoxOpen className="text-yellow-400" />;
    if (status === "Shipped")
      return <FaTruck className="text-blue-400" />;
    if (status === "Delivered")
      return <FaCheckCircle className="text-lime-300" />;
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white px-6 md:px-20 pt-25">

      {/* <h1 className="text-4xl font-bold text-center mb-6 tracking-wider">
        Your Orders
      </h1> */}
      <div className="text-center">
      <Heading highlight = 'Your Orders'/>
      </div>
      
      {orders.length === 0 ? (

        <div className="text-center mt-20">
          <h2 className="text-2xl mb-4">No Orders Yet 📦</h2>
          <p className="text-gray-400">
            Looks like you haven’t placed any orders.
          </p>
        </div>

      ) : (

        <div className="space-y-8 pb-6">

          {orders.map((order, index) => (

            <div
              key={index}
              className="bg-[#111] border border-[#222] rounded-2xl p-8 
              hover:shadow-xl hover:shadow-lime-300/10 transition duration-500"
            >

              {/* Top Row */}
              <div className="grid md:grid-cols-4 gap-6 mb-6">

                <div>
                  <p className="text-gray-400 text-sm">Order ID</p>
                  <p className="text-lime-300 font-bold text-lg">
                    {order.id}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm">Order Date</p>
                  <p>{order.date}</p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm">Total</p>
                  <p className="font-bold">${order.total}</p>
                </div>

                <div className="flex items-center gap-2 text-sm font-semibold">
                  {getStatusIcon(order.status)}
                  <span>{order.status}</span>
                </div>

              </div>

              {/* Customer Info */}
              <div className="border-t border-[#222] pt-4 pb-4">

                <p className="text-gray-400 mb-2 text-sm">Customer Details</p>

                <div className="grid md:grid-cols-2 gap-4 text-gray-300">

                  <p>
                    <span className="text-gray-400">Name:</span>{" "}
                    {order.customer?.firstName}
                  </p>

                  <p>
                    <span className="text-gray-400">Phone:</span>{" "}
                    {order.customer?.phone}
                  </p>

                  <p>
                    <span className="text-gray-400">Email:</span>{" "}
                    {order.customer?.email}
                  </p>

                  <p>
                    <span className="text-gray-400">Address:</span>{" "}
                    {order.customer?.street}, {order.customer?.city},{" "}
                    {order.customer?.state}, {order.customer?.postalCode}
                  </p>

                </div>

              </div>

              {/* Items */}
              <div className="border-t border-[#222] pt-4 space-y-2">

                <p className="text-gray-400 text-sm mb-2">Items</p>

                {order.items?.map((item, i) => (

                  <div
                    key={i}
                    className="flex justify-between text-gray-300"
                  >
                    <span>{item.name}</span>
                    <span>Qty: {item.quantity}</span>
                  </div>

                ))}

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
};

export default Orders;