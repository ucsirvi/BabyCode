import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import PropTypes from 'prop-types';

const MobileNav = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white dark:bg-gray-800 py-6 shadow-xl">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white">
                          Menu
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="rounded-md bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            onClick={onClose}
                          >
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                      <nav className="flex flex-col space-y-4">
                        <Link
                          to="/"
                          className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                          onClick={onClose}
                        >
                          Students
                        </Link>
                        {user ? (
                          <>
                            <Link
                              to="/add-student"
                              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                              onClick={onClose}
                            >
                              Add Student
                            </Link>
                            <button
                              onClick={handleLogout}
                              className="text-left text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                            >
                              Logout
                            </button>
                          </>
                        ) : (
                          <>
                            <Link
                              to="/login"
                              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                              onClick={onClose}
                            >
                              Login
                            </Link>
                            <Link
                              to="/register"
                              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                              onClick={onClose}
                            >
                              Register
                            </Link>
                          </>
                        )}
                        <button
                          onClick={toggleTheme}
                          className="text-left text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                        >
                          {darkMode ? 'Light Mode' : 'Dark Mode'}
                        </button>
                      </nav>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

MobileNav.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default MobileNav; 