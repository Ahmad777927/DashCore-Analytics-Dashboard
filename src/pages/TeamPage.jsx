import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Shield,
  Mail,
  Search,
  Trash2,
  X,
  Check,
  UserCheck,
  Send,
} from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmModal from '../components/ConfirmModal';
import {
  input,
  inputIcon,
  inputSmIcon,
  select,
  selectInline,
  label as labelClass,
} from '../components/formStyles';

const INITIAL_MEMBERS = [
  {
    id: 1,
    name: 'Alex Johnson',
    email: 'alex@company.com',
    role: 'Owner',
    department: 'Product & Executive',
    status: 'online',
    twoFactor: true,
    lastActive: 'Just now',
    avatarBg: 'bg-blue-600',
  },
  {
    id: 2,
    name: 'Sarah Connor',
    email: 'sarah.c@company.com',
    role: 'Admin',
    department: 'Engineering & DevOps',
    status: 'online',
    twoFactor: true,
    lastActive: '12m ago',
    avatarBg: 'bg-purple-600',
  },
  {
    id: 3,
    name: 'Kyle Reese',
    email: 'kyle.r@company.com',
    role: 'Editor',
    department: 'Growth & Marketing',
    status: 'away',
    twoFactor: true,
    lastActive: '2h ago',
    avatarBg: 'bg-emerald-600',
  },
  {
    id: 4,
    name: 'Rick Deckard',
    email: 'r.deckard@company.com',
    role: 'Editor',
    department: 'Finance & Accounting',
    status: 'offline',
    twoFactor: false,
    lastActive: 'Yesterday',
    avatarBg: 'bg-amber-600',
  },
  {
    id: 5,
    name: 'Ellen Ripley',
    email: 'ripley@company.com',
    role: 'Viewer',
    department: 'Customer Success',
    status: 'online',
    twoFactor: true,
    lastActive: '34m ago',
    avatarBg: 'bg-rose-600',
  },
];

const INITIAL_INVITES = [
  {
    id: 'inv-1',
    email: 'miles.dyson@cyberdyne.io',
    role: 'Admin',
    invitedBy: 'Alex Johnson',
    sentDate: '2 days ago',
    expiresIn: '5 days',
  },
  {
    id: 'inv-2',
    email: 'trinity@matrix.org',
    role: 'Editor',
    invitedBy: 'Sarah Connor',
    sentDate: 'Yesterday',
    expiresIn: '6 days',
  },
];

const PERMISSIONS = [
  { feature: 'View Dashboard & Analytics', owner: true, admin: true, editor: true, viewer: true },
  { feature: 'Export Reports & Download CSV/PDF', owner: true, admin: true, editor: true, viewer: false },
  { feature: 'Manage Customers & Orders', owner: true, admin: true, editor: true, viewer: false },
  { feature: 'Invite New Team Members', owner: true, admin: true, editor: false, viewer: false },
  { feature: 'Manage Subscriptions & Billing', owner: true, admin: false, editor: false, viewer: false },
  { feature: 'Security & System Health Settings', owner: true, admin: true, editor: false, viewer: false },
];

export default function TeamPage() {
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [invites, setInvites] = useState(INITIAL_INVITES);
  const [roleFilter, setRoleFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Invite Form State
  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: 'Editor',
    department: 'Engineering',
  });

  const filteredMembers = members.filter((m) => {
    if (roleFilter !== 'all' && m.role.toLowerCase() !== roleFilter.toLowerCase()) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.department.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleRoleChange = (memberId, newRole) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m))
    );
    toast.success(`Role updated to ${newRole}`);
  };

  const handleSendInvite = (e) => {
    e.preventDefault();
    if (!inviteForm.email.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    const newInvite = {
      id: `inv-${Date.now()}`,
      email: inviteForm.email,
      role: inviteForm.role,
      invitedBy: 'Alex Johnson',
      sentDate: 'Just now',
      expiresIn: '7 days',
    };

    setInvites((prev) => [newInvite, ...prev]);
    setIsInviteModalOpen(false);
    setInviteForm({ email: '', role: 'Editor', department: 'Engineering' });
    toast.success(`Invitation sent to ${newInvite.email}!`, { icon: '✉️' });
  };

  const handleResendInvite = (email) => {
    toast.success(`Invitation resent to ${email}`, { id: 'resend-invite' });
  };

  const handleRevokeInvite = (id) => {
    setInvites((prev) => prev.filter((inv) => inv.id !== id));
    toast.success('Invitation revoked successfully', { id: 'revoke-invite' });
  };

  const handleRemoveClick = (member) => {
    if (member.role === 'Owner') {
      toast.error('The workspace Owner cannot be removed.');
      return;
    }
    setMemberToDelete(member);
    setIsConfirmOpen(true);
  };

  const confirmRemoveMember = () => {
    if (memberToDelete) {
      setMembers((prev) => prev.filter((m) => m.id !== memberToDelete.id));
      toast.success(`${memberToDelete.name} has been removed from the team.`);
      setMemberToDelete(null);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Team & Access Governance
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Manage organization members, assign granular access roles, and audit security compliance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsInviteModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-blue-600/30 transition-colors"
          >
            <UserPlus size={15} />
            <span>Invite Teammate</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards aligned with dashboard top palette */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Members (Blue) */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-600/25">
              <Users size={20} />
            </div>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
              Seat Limit 15
            </span>
          </div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Total Team Size
          </p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {members.length} Members
          </h3>
        </div>

        {/* Card 2: Active Now (Green) */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-sm shadow-emerald-600/25">
              <UserCheck size={20} />
            </div>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Live
            </span>
          </div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Active Right Now
          </p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {members.filter((m) => m.status === 'online').length} Online
          </h3>
        </div>

        {/* Card 3: Pending Invites (Orange) */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-amber-600 text-white shadow-sm shadow-orange-600/25">
              <Mail size={20} />
            </div>
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
              Pending
            </span>
          </div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Outstanding Invites
          </p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {invites.length} Pending
          </h3>
        </div>

        {/* Card 4: 2FA Enforcement (Purple) */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-purple-600 text-white shadow-sm shadow-purple-600/25">
              <Shield size={20} />
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300">
              High Security
            </span>
          </div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            2FA Adoption
          </p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {Math.round((members.filter((m) => m.twoFactor).length / members.length) * 100)}% Enforced
          </h3>
        </div>
      </div>

      {/* Main Team Members Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Table Controls */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            {['all', 'admin', 'editor', 'viewer'].map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setRoleFilter(role)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-colors ${roleFilter === role
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
              >
                {role === 'all' ? 'All Members' : `${role}s`}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search member, email, team..."
              className={inputSmIcon}
            />
          </div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-3.5">Member</th>
                <th className="px-6 py-3.5">Department</th>
                <th className="px-6 py-3.5">Assigned Role</th>
                <th className="px-6 py-3.5">2FA Status</th>
                <th className="px-6 py-3.5">Last Active</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    No members match the active filter.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr
                    key={member.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div
                            className={`w-9 h-9 rounded-full ${member.avatarBg} text-white font-bold flex items-center justify-center text-xs shadow-sm`}
                          >
                            {member.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </div>
                          <span
                            className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-slate-900 ${member.status === 'online'
                                ? 'bg-emerald-500'
                                : member.status === 'away'
                                  ? 'bg-amber-500'
                                  : 'bg-slate-400'
                              }`}
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {member.name}
                          </p>
                          <p className="text-xs text-slate-400">{member.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-xs font-medium text-slate-700 dark:text-slate-300">
                      {member.department}
                    </td>

                    <td className="px-6 py-4">
                      {member.role === 'Owner' ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                          Owner
                        </span>
                      ) : (
                        <select
                          value={member.role}
                          onChange={(e) => handleRoleChange(member.id, e.target.value)}
                          className={selectInline}
                        >
                          <option value="Admin">Admin</option>
                          <option value="Editor">Editor</option>
                          <option value="Viewer">Viewer</option>
                        </select>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {member.twoFactor ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40">
                          <Check size={12} />
                          Enforced
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40">
                          Disabled
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400">
                      {member.lastActive}
                    </td>

                    <td className="px-6 py-4 text-right">
                      {member.role !== 'Owner' && (
                        <button
                          type="button"
                          onClick={() => handleRemoveClick(member)}
                          className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
                          title="Remove teammate"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pending Invitations Section */}
      {invites.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Pending Invitations
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Invited users who haven't accepted their access email yet.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
              {invites.length} pending
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {invites.map((inv) => (
              <div
                key={inv.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white font-mono">
                      {inv.email}
                    </p>
                    <span className="text-xs font-semibold px-2 py-0.2 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                      {inv.role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Invited by {inv.invitedBy} • Expires in {inv.expiresIn}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleResendInvite(inv.email)}
                    className="px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors"
                  >
                    Resend Email
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRevokeInvite(inv.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
                  >
                    Revoke
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Role & Permissions Matrix */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Role & Capability Matrix
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Access breakdown granted across system modules based on assigned role.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase font-semibold">
              <tr>
                <th className="px-4 py-2.5">System Privilege</th>
                <th className="px-4 py-2.5 text-center">Owner</th>
                <th className="px-4 py-2.5 text-center">Admin</th>
                <th className="px-4 py-2.5 text-center">Editor</th>
                <th className="px-4 py-2.5 text-center">Viewer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {PERMISSIONS.map((p, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">
                    {p.feature}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {p.owner ? (
                      <Check size={15} className="text-blue-600 mx-auto" />
                    ) : (
                      <span className="text-slate-300 dark:text-slate-700">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {p.admin ? (
                      <Check size={15} className="text-purple-600 mx-auto" />
                    ) : (
                      <span className="text-slate-300 dark:text-slate-700">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {p.editor ? (
                      <Check size={15} className="text-emerald-600 mx-auto" />
                    ) : (
                      <span className="text-slate-300 dark:text-slate-700">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {p.viewer ? (
                      <Check size={15} className="text-slate-600 dark:text-slate-400 mx-auto" />
                    ) : (
                      <span className="text-slate-300 dark:text-slate-700">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                  <UserPlus size={18} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Invite Teammate
                </h3>
              </div>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSendInvite} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className={labelClass}>
                  Work Email Address
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="email"
                    required
                    placeholder="teammate@company.com"
                    value={inviteForm.email}
                    onChange={(e) =>
                      setInviteForm({ ...inviteForm, email: e.target.value })
                    }
                    className={inputIcon}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className={labelClass}>
                  Assign Access Role
                </label>
                <select
                  value={inviteForm.role}
                  onChange={(e) =>
                    setInviteForm({ ...inviteForm, role: e.target.value })
                  }
                  className={select}
                >
                  <option value="Admin">Admin (Full write & export access)</option>
                  <option value="Editor">Editor (Edit orders & customers)</option>
                  <option value="Viewer">Viewer (Read-only analytics access)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className={labelClass}>
                  Department / Squad
                </label>
                <input
                  type="text"
                  placeholder="e.g. Engineering, Sales, Support"
                  value={inviteForm.department}
                  onChange={(e) =>
                    setInviteForm({ ...inviteForm, department: e.target.value })
                  }
                  className={input}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm shadow-blue-600/30 flex items-center gap-1.5"
                >
                  <Send size={13} />
                  <span>Send Invitation</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Remove Teammate Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmRemoveMember}
        title="Remove Teammate?"
        message={`Are you sure you want to remove ${memberToDelete?.name} (${memberToDelete?.email})? They will immediately lose access to this dashboard.`}
      />
    </div>
  );
}
