import React, { useMemo, useState } from "react";
import { Lock, Eye, EyeOff, Shield, CheckCircle } from "lucide-react";
import { API_BASE_URL } from "../../../config";
import { useSelector } from "react-redux";
import axios from "axios";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const user = useSelector((state) => state.user.value);

  const config = useMemo(
    () => ({
      headers: { Authorization: user.access_token },
    }),
    [user.access_token]
  );

  const validatePassword = (password) => {
    if (!password) return "Please enter your new password!";
    if (password.length < 6) return "Password must be at least 6 characters.";
    return "";
  };

  const validateConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword) return "Please confirm your password!";
    if (confirmPassword !== password) return "Passwords do not match!";
    return "";
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    validateField(field);
  };

  const validateField = (field) => {
    let error = "";
    if (field === "password") {
      error = validatePassword(formData.password);
    } else if (field === "confirmPassword") {
      error = validateConfirmPassword(formData.confirmPassword, formData.password);
    }
    setErrors({ ...errors, [field]: error });
    return error;
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (touched[field]) {
      setTimeout(() => validateField(field), 0);
    }
  };

  const onFinish = async (e) => {
    e.preventDefault();

    setTouched({ password: true, confirmPassword: true });

    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(formData.confirmPassword, formData.password);

    setErrors({
      password: passwordError,
      confirmPassword: confirmPasswordError,
    });

    if (!passwordError && !confirmPasswordError) {
      try {
        await axios.patch(
          `${API_BASE_URL}user/change/password`,
          { password: formData.password },
          config
        );

        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setFormData({ password: "", confirmPassword: "" });
          setTouched({});
          setErrors({});
        }, 2000);
      } catch (error) {
        if (error.response && error.response.data) {
          console.error("Error updating password:", error.response.data);
        } else {
          console.error("Network or server error:", error);
        }
      }
    }
  };

  const onCancel = () => {
    setFormData({ password: "", confirmPassword: "" });
    setErrors({});
    setTouched({});
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: "", color: "" };
    if (password.length < 6) return { strength: 33, label: "Weak", color: "bg-red-500" };
    if (password.length < 10) return { strength: 66, label: "Medium", color: "bg-yellow-500" };
    return { strength: 100, label: "Strong", color: "bg-green-500" };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-md lg:max-w-2xl">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-center">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Change Password</h2>
            <p className="text-purple-100">Secure your account with a new password</p>
          </div>

          {/* Form */}
          <form onSubmit={onFinish} className="p-8 lg:p-12">
            {/* New Password Field */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4 text-purple-600" />
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  onBlur={() => handleBlur("password")}
                  placeholder="Enter new password"
                  className={`w-full px-4 py-3 pr-12 border-2 rounded-xl focus:outline-none transition-all ${
                    touched.password && errors.password
                      ? "border-red-400 focus:border-red-500"
                      : "border-gray-200 focus:border-purple-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-600 font-medium">Password Strength</span>
                    <span
                      className={`text-xs font-semibold ${
                        passwordStrength.strength === 100
                          ? "text-green-600"
                          : passwordStrength.strength === 66
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full ${passwordStrength.color} transition-all duration-300`}
                      style={{ width: `${passwordStrength.strength}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {touched.password && errors.password && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <span className="text-lg">⚠</span> {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="mb-8">
              <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4 text-purple-600" />
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  onBlur={() => handleBlur("confirmPassword")}
                  placeholder="Confirm new password"
                  className={`w-full px-4 py-3 pr-12 border-2 rounded-xl focus:outline-none transition-all ${
                    touched.confirmPassword && errors.confirmPassword
                      ? "border-red-400 focus:border-red-500"
                      : touched.confirmPassword && !errors.confirmPassword && formData.confirmPassword
                      ? "border-green-400 focus:border-green-500"
                      : "border-gray-200 focus:border-purple-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {touched.confirmPassword && !errors.confirmPassword && formData.confirmPassword && (
                <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" /> Passwords match!
                </p>
              )}

              {touched.confirmPassword && errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <span className="text-lg">⚠</span> {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                Submit
              </button>
            </div>
          </form>

          {/* Success Message */}
          {showSuccess && (
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
              <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center transform transition-all scale-100 animate-in">
                <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Success!</h3>
                <p className="text-gray-600">Your password has been changed successfully.</p>
              </div>
            </div>
          )}
        </div>

        {/* Security Tips */}
        <div className="mt-6 bg-white bg-opacity-60 backdrop-blur-sm rounded-xl p-4 text-sm text-gray-600">
          <p className="font-semibold text-gray-700 mb-2">💡 Password Tips:</p>
          <ul className="space-y-1 pl-4">
            <li>• Use at least 6 characters (10+ recommended)</li>
            <li>• Mix uppercase, lowercase, numbers & symbols</li>
            <li>• Avoid common words or personal information</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
