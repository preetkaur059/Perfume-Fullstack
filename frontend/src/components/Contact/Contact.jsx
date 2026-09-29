import React from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import Heading from "../Heading/Heading";

const contactValidationSchema = Yup.object({
  username: Yup.string().trim().required("Name is required"),
  email: Yup.string()
    .trim()
    .email("Please enter a valid email address")
    .required("Email is required"),
  msg: Yup.string().trim().required("Message is required"),
});

const Contact = () => {
  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      msg: "",
    },
    validationSchema: contactValidationSchema,
    onSubmit: (values, { resetForm }) => {
      toast.success("Thank you for reaching out! We will get back to you soon.");
      resetForm();
    },
  });

  return (
    <div className="bg-black text-white pt-25 pb-20">
      <div className="max-w-[1200px] mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-13">
          <Heading highlight="Get In Touch" />
          <p className="text-gray-400 mt-2 max-w-[600px] mx-auto leading-7">
            Have questions about our fragrances or your order? Our team is
            always ready to assist you. Feel free to contact us anytime.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-13">

          <div className="bg-[#111] border border-[#333] p-5 text-center rounded-lg hover:scale-102 transform duration-300 hover:border-lime-200 transition">
            <FaMapMarkerAlt className="text-2xl mx-auto mb-4 text-lime-200" />
            <h3 className="text-xl font-medium mb-2">Our Store</h3>
            <p className="text-gray-400">
              Zivara Fragrance Store <br />
              Ludhiana, Punjab
            </p>
          </div>

          <div className="bg-[#111] border border-[#333] p-5 text-center rounded-lg hover:border-lime-200 hover:scale-102 transform duration-300 transition">
            <FaPhoneAlt className="text-2xl mx-auto mb-4 text-lime-200" />
            <h3 className="text-xl font-medium mb-2">Call Us</h3>
            <p className="text-gray-400">
              +91 98765 43210
            </p>
          </div>

          <div className="bg-[#111] border border-[#333] p-5 text-center rounded-lg hover:border-lime-200 hover:scale-102 transform duration-300 transition">
            <FaEnvelope className="text-2xl mx-auto mb-4 text-lime-200" />
            <h3 className="text-xl font-medium mb-2">Email Us</h3>
            <p className="text-gray-400">
              support@zivara.com
            </p>
          </div>

        </div>

        {/* Contact Form */}
        <div className="max-w-[700px] mx-auto bg-[#111] border border-[#333] p-10 rounded-lg">

          <h2 className="text-2xl font-medium mb-6 text-center">
            Send Us A Message
          </h2>

          <form className="space-y-5" onSubmit={formik.handleSubmit}>

            <div>
              <input
                type="text"
                name="username"
                placeholder="Your Name"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full p-3 bg-black border ${
                  formik.touched.username && formik.errors.username
                    ? "border-red-500"
                    : "border-[#333]"
                } rounded outline-none focus:border-lime-200`}
              />
              {formik.touched.username && formik.errors.username && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.username}</p>
              )}
            </div>

            <div>
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full p-3 bg-black border ${
                  formik.touched.email && formik.errors.email
                    ? "border-red-500"
                    : "border-[#333]"
                } rounded outline-none focus:border-lime-200`}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
              )}
            </div>

            <div>
              <textarea
                rows="5"
                name="msg"
                placeholder="Your Message"
                value={formik.values.msg}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full p-3 bg-black border ${
                  formik.touched.msg && formik.errors.msg
                    ? "border-red-500"
                    : "border-[#333]"
                } rounded outline-none focus:border-lime-200`}
              ></textarea>
              {formik.touched.msg && formik.errors.msg && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.msg}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 cursor-pointer bg-lime-200 text-black font-semibold rounded hover:bg-lime-300 hover:scale-102 transform duration-300 transition"
            >
              Send Message
            </button>

          </form>

        </div>

      </div>
    </div>
  );
};

export default Contact;
