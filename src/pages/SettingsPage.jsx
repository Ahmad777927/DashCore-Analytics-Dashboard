import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Mail,
  Shield,
  Bell,
  Trash2,
  Save,
  Edit3,
  X,
  AlertTriangle,
  RotateCcw,
  Loader2,
  Building2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmModal from '../components/ConfirmModal';
import { inputIcon, checkbox, hint as hintClass, label as labelClass } from '../components/formStyles';

/*The editable slice of the profile — mirrors the PATCH /api/auth/me payload. */
function profileFromUser(user) {
  return {
    name: user?.name || '',
    email: user?.email || '',
    department: user?.department || '',
  };
}

const DEFAULT_NOTIFICATIONS = {
  emailReports: true,
  pushAlerts: true,
  weeklyDigest: false,
  orderUpdates: true,
};

export default function SettingsPage() {
  const { user, updateUserProfile } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [deleteActionType, setDeleteActionType] = useState('cache'); // 'cache' | 'account'

  const [formData, setFormData] = useState(() => profileFromUser(user));

  const [notifications, setNotifications] = useState(DEFAULT_NOTIFICATIONS);

  // `formData` is only the in-progress draft. While the form is not in edit
  // mode the fields render the live account values straight from context, so
  // they can never show stale or placeholder data.
  const values = isEditing ? formData : profileFromUser(user);

  const handleStartEdit = () => {
    setFormData(profileFromUser(user)); // start editing from the saved values
    setIsEditing(true);
    toast('Editing profile information', { icon: '✏️', id: 'edit-profile-toast' });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    toast('Profile edit discarded', { icon: '↩️', id: 'cancel-profile-toast' });
  };

  /**
   * Persists the profile through the API (PATCH /api/auth/me). On success the
   * server's user is mirrored into AuthContext, so the navbar, greeting and
   * user menu all reflect the new values; on failure we stay in edit mode so
   * nothing is silently lost.
   */
  const saveProfile = async (successMessage, toastId) => {
    setIsSaving(true);
    try {
      await updateUserProfile({
        name: values.name,
        email: values.email,
        department: values.department,
      });
      setIsEditing(false);
      toast.success(successMessage, { id: toastId });
      return true;
    } catch (err) {
      const firstFieldError = err?.errors?.[0]?.message;
      toast.error(firstFieldError || err?.message || 'Could not save your profile.', {
        id: toastId,
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    saveProfile('Profile saved to your account!', 'save-profile-toast');
  };

  const handleNotificationToggle = (key, label) => {
    const nextVal = !notifications[key];
    setNotifications((prev) => ({ ...prev, [key]: nextVal }));
    toast.success(`${label} ${nextVal ? 'enabled' : 'disabled'}`, {
      id: `notification-toggle-${key}`,
    });
  };

  const handleSaveAllSettings = () => {
    saveProfile('All changes saved successfully!', 'save-all-settings');
  };

  const handleDeleteClick = (type = 'cache') => {
    setDeleteActionType(type);
    setIsConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteActionType === 'cache') {
      try {
        localStorage.removeItem('dashboard_notifications');
      } catch {
        // ignore
      }
      toast.success('Settings cache and notification history deleted!', {
        id: 'delete-action-toast',
      });
    } else {
      // Reset: clear the profile customisation (department) in the database and
      // restore the notification preferences to their defaults.
      try {
        await updateUserProfile({ department: '' });
        setFormData((prev) => ({ ...prev, department: '' }));
        setNotifications(DEFAULT_NOTIFICATIONS);
        toast.success('Profile customisations cleared and preferences reset!', {
          id: 'delete-action-toast',
        });
      } catch (err) {
        toast.error(err?.message || 'Could not reset your settings.', {
          id: 'delete-action-toast',
        });
      }
    }
    setIsConfirmDeleteOpen(false);
  };

  return (
    <div className="max-w-4xl space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Manage your account credentials, notifications, and application preferences.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isEditing ? (
            <button
              type="button"
              onClick={handleStartEdit}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-xs font-semibold transition-colors"
            >
              <Edit3 size={14} />
              <span>Edit Profile</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={isSaving}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60"
              >
                <X size={14} />
                <span>Cancel</span>
              </button>
              <button
                type="button"
                onClick={handleSaveAllSettings}
                disabled={isSaving}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm shadow-blue-600/30 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSaving ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Save size={14} />
                )}
                <span>{isSaving ? 'Saving…' : 'Save Changes'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Settings Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
        {/* Section 1: Profile Information */}
        <form onSubmit={handleSaveProfile} className="p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-900/50">
                <User size={18} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Profile Information
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Your public profile and contact address.
                </p>
              </div>
            </div>

            {isEditing && (
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                Edit Mode Active
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className={labelClass} htmlFor="settings-name">
                Full Name
              </label>
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="settings-name"
                  type="text"
                  disabled={!isEditing || isSaving}
                  value={values.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={inputIcon}
                  placeholder="e.g. Alex Johnson"
                  required
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className={labelClass} htmlFor="settings-email">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="settings-email"
                  type="email"
                  disabled={!isEditing || isSaving}
                  value={values.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={inputIcon}
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            {/* Role — read-only: permission levels are workspace-managed */}
            <div className="space-y-1.5">
              <label className={labelClass} htmlFor="settings-role">
                Role / Access Level
              </label>
              <div className="relative">
                <Shield
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="settings-role"
                  type="text"
                  value={user?.role || 'Member'}
                  readOnly
                  disabled
                  className={inputIcon}
                  placeholder="Assigned by your administrator"
                />
              </div>
              <p className={hintClass}>Managed by your workspace administrator.</p>
            </div>

            {/* Department / Team */}
            <div className="space-y-1.5">
              <label className={labelClass} htmlFor="settings-department">
                Department / Team
              </label>
              <div className="relative">
                <Building2
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="settings-department"
                  type="text"
                  disabled={!isEditing || isSaving}
                  value={values.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className={inputIcon}
                  placeholder="e.g. Engineering, Sales, Support"
                />
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={isSaving}
                className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm shadow-blue-600/30 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                <span>{isSaving ? 'Saving…' : 'Save Profile Changes'}</span>
              </button>
            </div>
          )}
        </form>

        {/* Section 2: Notification Preferences */}
        <div className="p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-200 dark:border-purple-900/50">
              <Bell size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Notification Preferences
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configure your alert channels and reporting frequencies.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email reports */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 flex items-center justify-between transition-colors">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Email Reports
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Receive summary reports via email
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifications.emailReports}
                onChange={() =>
                  handleNotificationToggle('emailReports', 'Email reports')
                }
                className={checkbox}
              />
            </div>

            {/* Desktop Push alerts */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 flex items-center justify-between transition-colors">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Desktop Push Alerts
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Real-time alerts for live events
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifications.pushAlerts}
                onChange={() =>
                  handleNotificationToggle('pushAlerts', 'Push alerts')
                }
                className={checkbox}
              />
            </div>

            {/* Order Updates */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 flex items-center justify-between transition-colors">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Order & Revenue Alerts
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Notify when new purchases occur
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifications.orderUpdates}
                onChange={() =>
                  handleNotificationToggle('orderUpdates', 'Order alerts')
                }
                className={checkbox}
              />
            </div>

            {/* Weekly Digest */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 flex items-center justify-between transition-colors">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Weekly Analytics Digest
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Curated insights every Monday
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifications.weeklyDigest}
                onChange={() =>
                  handleNotificationToggle('weeklyDigest', 'Weekly digest')
                }
                className={checkbox}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Danger Zone (Delete / Reset Actions) */}
        <div className="p-6 md:p-8 bg-red-50/40 dark:bg-red-950/10 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center">
              <AlertTriangle size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-red-900 dark:text-red-400">
                Danger Zone
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Irreversible actions for your local settings and account data.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/40">
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                Delete Saved Cache & Preferences
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Clears cached notification history and resets local storage preferences.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleDeleteClick('cache')}
              className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 dark:bg-red-950/40 dark:hover:bg-red-900/50 dark:text-red-300 border border-red-200 dark:border-red-800 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0"
            >
              <Trash2 size={14} />
              <span>Delete Cache</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/40">
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                Reset Account Settings
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Clears your department/team customisation and restores the default notification
                preferences.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleDeleteClick('account')}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 shadow-sm"
            >
              <RotateCcw size={14} />
              <span>Reset & Delete</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title={
          deleteActionType === 'cache'
            ? 'Delete Cached Preferences?'
            : 'Reset & Delete Account Settings?'
        }
        message={
          deleteActionType === 'cache'
            ? 'This action will delete your cached notifications and stored preferences. This cannot be undone.'
            : 'This clears your department/team customisation and restores the default notification preferences.'
        }
      />
    </div>
  );
}
