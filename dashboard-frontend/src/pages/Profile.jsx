import { useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import { User, Mail, Lock, CheckCircle2, AlertCircle, Loader2, Camera } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name,
      email: user?.email,
    },
  });

  const onSubmit = async (data) => {
    try {
      setError('');
      setSuccess('');
      setIsLoading(true);
      if (data.password && data.password !== data.confirmPassword) {
        throw new Error('Passwords do not match');
      }
      const updateData = { name: data.name, email: data.email };
      if (data.password) updateData.password = data.password;
      
      await updateProfile(updateData);
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Account Settings</h1>
          <p className="text-slate-500 mt-1">Manage your personal information and security</p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
          <div className="px-8 pb-8">
            <div className="relative -mt-12 mb-8">
              <div className="h-24 w-24 rounded-3xl bg-white p-1 shadow-lg">
                <div className="h-full w-full rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-bold border-4 border-white">
                  {user?.name?.charAt(0)}
                </div>
              </div>
              <button className="absolute bottom-0 right-[-8px] p-2 bg-white rounded-xl shadow-md border border-slate-100 text-slate-400 hover:text-blue-600 transition-colors">
                <Camera size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-1">
                <h2 className="text-xl font-bold text-slate-900 mb-2">Personal info</h2>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Update your photo and personal details here. Changes will be reflected across the platform.
                </p>
              </div>

              <div className="lg:col-span-2 space-y-8">
                {error && (
                  <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-center text-red-700">
                    <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
                    <p className="text-sm font-medium">{error}</p>
                  </div>
                )}
                {success && (
                  <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-lg flex items-center text-green-700">
                    <CheckCircle2 className="h-5 w-5 mr-3 flex-shrink-0" />
                    <p className="text-sm font-medium">{success}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                        <input 
                          {...register('name', { required: 'Name is required' })}
                          className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                        <input 
                          {...register('email', { 
                            required: 'Email is required',
                            pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
                          })}
                          className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Change Password</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">New Password</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                          <input 
                            type="password"
                            {...register('password', { minLength: 6 })}
                            placeholder="Leave blank to keep same"
                            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm Password</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                          <input 
                            type="password"
                            {...register('confirmPassword')}
                            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button 
                      disabled={isLoading}
                      className="px-8 py-3.5 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-70 flex items-center"
                    >
                      {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
