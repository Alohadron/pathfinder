import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail } from 'lucide-react';

const Card = ({ children, className = '' }) => (
  <div className={`rounded-3xl shadow-lg bg-white ${className}`}>{children}</div>
);

const CardContent = ({ children, className = '' }) => (
  <div className={className}>{children}</div>
);

const Button = ({ children, className = '', ...props }) => (
  <button className={`py-3 px-5 rounded-xl font-semibold transition-all ${className}`} {...props}>
    {children}
  </button>
);

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState('');

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const passwordValue = watch('password');

  const onSubmit = (data) => {
    console.log(data);
    alert(`${isLogin ? 'Login' : 'Register'} successful!`);
  };

  const handleOutlookLogin = () => {
    alert('Redirecting to Outlook login...');
  };

  const OutlookButton = () => (
    <Button
      type="button"
      onClick={handleOutlookLogin}
      className="w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 hover:from-blue-600 hover:via-indigo-600 hover:to-cyan-500 text-white flex items-center justify-center gap-2 py-3 rounded-xl text-lg font-semibold shadow-[0_2px_10px_rgba(0,0,80,0.3)] hover:scale-[1.03] transition-transform animate-gradient-x"
    >
      <Mail size={20} /> Continue with Outlook
    </Button>
  );

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden p-4 bg-cover bg-center"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1600&q=80')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/70 via-white/60 to-blue-200/40 backdrop-blur-sm" />

      <div className="flex flex-col items-center -space-y-1 mb-6 relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-wider text-blue-700 drop-shadow-2xl"
        >
          UTM
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-blue-700 text-sm font-medium tracking-wide"
        >
          Universitatea Tehnică a Moldovei
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className={`relative z-10 w-full ${isLogin ? 'max-w-md' : 'max-w-4xl'}`}
      >
        <Card className="shadow-[0_0_40px_rgba(100,180,255,0.25)] rounded-3xl bg-gradient-to-br from-white/90 via-blue-50/70 to-blue-100/60 backdrop-blur-md border-[3px] border-blue-200/60">
          <CardContent className="p-10">
            <h2 className="text-3xl font-extrabold text-center text-blue-800 mb-8 tracking-wide drop-shadow-sm">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>

            {!isLogin && (
              <>
                <OutlookButton />
                <div className="flex items-center my-6">
                  <div className="flex-1 h-px bg-blue-200"></div>
                  <span className="px-3 text-blue-700 text-sm font-semibold">or</span>
                  <div className="flex-1 h-px bg-blue-200"></div>
                </div>
              </>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <AnimatePresence mode="wait" initial={false}>
                {!isLogin && (
                  <motion.div
                    key="register-fields"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 0, transition: { duration: 0 } }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-semibold text-blue-900">First Name</label>
                        <input id="firstName" {...register('firstName', { required: 'First name is required' })} className="w-full p-3 border border-blue-100 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none bg-white/80 text-blue-900" placeholder="John" />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-semibold text-blue-900">Last Name</label>
                        <input id="lastName" {...register('lastName', { required: 'Last name is required' })} className="w-full p-3 border border-blue-100 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none bg-white/80 text-blue-900" placeholder="Doe" />
                      </div>
                      <div>
                        <label htmlFor="age" className="block text-sm font-semibold text-blue-900">Age</label>
                        <input id="age" type="number" {...register('age', { required: 'Age is required' })} className="w-full p-3 border border-blue-100 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none bg-white/80 text-blue-900" placeholder="20" />
                      </div>
                      <div>
                        <label htmlFor="sex" className="block text-sm font-semibold text-blue-900">Sex</label>
                        <select id="sex" {...register('sex', { required: 'Sex is required' })} className="w-full p-3 border border-blue-100 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none bg-white/80 text-blue-900">
                          <option value="">Select</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="faculty" className="block text-sm font-semibold text-blue-900">Faculty</label>
                        <select id="faculty" {...register('faculty', { required: true })} onChange={(e) => setSelectedFaculty(e.target.value)} className="w-full p-3 mt-1 border border-blue-100 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none bg-white/80 text-blue-900">
                          <option value="">Select faculty</option>
                          <option value="FCIM">FCIM - Calculatoare, Informatică și Microelectronică</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="group" className="block text-sm font-semibold text-blue-900">Group</label>
                        <select id="group" {...register('group', { required: true })} disabled={selectedFaculty !== 'FCIM'} className={`w-full p-3 mt-1 border border-blue-100 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-blue-900 ${selectedFaculty !== 'FCIM' ? 'bg-gray-200 cursor-not-allowed' : 'bg-white/80'}`}>
                          <option value="">Select group</option>
                          {selectedFaculty === 'FCIM' && (
                            <>
                              <option value="SD-251">SD-251 - Știința datelor</option>
                              <option value="IA-251">IA-251 - Informatica aplicată</option>
                              <option value="IA-252">IA-252 - Informatica aplicată</option>
                            </>
                          )}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-blue-900">Email</label>
                        <input id="email" type="email" {...register('email', { required: 'Email is required' })} className="w-full p-3 border border-blue-100 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none bg-white/80 text-blue-900" placeholder="you@example.com" />
                      </div>
                      <div className="relative">
                        <label htmlFor="password" className="block text-sm font-semibold text-blue-900">Password</label>
                        <input id="password" type={showPassword ? 'text' : 'password'} {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'At least 6 characters' } })} className="w-full p-3 border border-blue-100 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none bg-white/80 text-blue-900" placeholder="••••••••" />
                        <button type="button" className="absolute right-3 top-9 text-blue-700" onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-semibold text-blue-900">Confirm Password</label>
                        <input id="confirmPassword" type={showPassword ? 'text' : 'password'} {...register('confirmPassword', { required: 'Please confirm your password', validate: (value) => value === passwordValue || 'Passwords do not match' })} className="w-full p-3 border border-blue-100 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none bg-white/80 text-blue-900" placeholder="••••••••" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {isLogin && (
                <>
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-blue-900">Email</label>
                    <input id="email" type="email" {...register('email', { required: 'Email is required' })} className="w-full p-3 border border-blue-100 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none bg-white/80 text-blue-900" placeholder="you@example.com" />
                  </div>
                  <div className="relative mt-6">
                    <label htmlFor="password" className="block text-sm font-semibold text-blue-900">Password</label>
                    <input id="password" type={showPassword ? 'text' : 'password'} {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'At least 6 characters' } })} className="w-full p-3 border border-blue-100 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none bg-white/80 text-blue-900" placeholder="••••••••" />
                    <button type="button" className="absolute right-3 top-9 text-blue-700" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <div className="flex justify-end -mt-2">
                    <button type="button" className="text-xs font-semibold text-blue-700 hover:text-blue-900 hover:underline" onClick={() => alert('Password reset flow coming soon.')}>Forgot password?</button>
                  </div>
                </>
              )}

              <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 hover:from-blue-700 hover:via-indigo-600 hover:to-cyan-500 text-white rounded-xl py-3 text-lg font-semibold shadow-[0_2px_10px_rgba(0,0,80,0.3)] transition-transform transform hover:scale-[1.03] animate-gradient-x">
                {isLogin ? 'Login' : 'Register'}
              </Button>
            </form>

            <div className="text-center mt-6">
              <p className="text-sm text-blue-700">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}
                <button className="ml-1 text-blue-900 font-bold hover:underline" type="button" onClick={() => setIsLogin((prev) => !prev)}>
                  {isLogin ? 'Sign up' : 'Login'}
                </button>
              </p>
              {isLogin && (
                <>
                  <div className="flex items-center my-4">
                    <div className="flex-1 h-px bg-blue-200"></div>
                    <span className="px-3 text-blue-700 text-sm font-semibold">or</span>
                    <div className="flex-1 h-px bg-blue-200"></div>
                  </div>
                  <OutlookButton />
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
