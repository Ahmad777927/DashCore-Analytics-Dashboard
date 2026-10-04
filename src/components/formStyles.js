/**
 * Shared form-control styles.
 *
 * Every input, select and textarea in the dashboard pulls its look from here
 * so paddings, radii, focus rings, disabled states and dark-mode colours stay
 * identical across pages and modals.
 *
 * Usage: `className={input}` · `className={`${inputIcon} pr-4`}`
 */

/* Core look: surface, border, radius, focus ring, disabled state. */
const controlBase =
  'rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 shadow-sm transition-all ' +
  'placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 ' +
  'disabled:cursor-not-allowed disabled:opacity-60 ' +
  'dark:border-slate-700 dark:bg-slate-800/60 dark:text-white dark:placeholder:text-slate-500 ' +
  'dark:focus:border-blue-500 dark:focus:bg-slate-800 dark:disabled:opacity-50';

/* Most controls fill their container; the few auto-width ones skip `w-full`. */
const control = `w-full ${controlBase}`;

/* Text input, default size (forms inside cards and modals). */
export const input = `${control} px-3.5 py-2.5 text-sm`;

/* Text input with a leading icon absolutely positioned at left-3.5. */
export const inputIcon = `${control} py-2.5 pl-10 pr-3.5 text-sm`;

/* Leading icon + trailing affordance (e.g. a show/hide password toggle). */
export const inputIconBoth = `${control} py-2.5 pl-10 pr-10 text-sm`;

/* Compact input for toolbars / table filters. */
export const inputSm = `${control} px-3 py-2 text-sm`;

/* Compact input with a leading icon (search fields above tables). */
export const inputSmIcon = `${control} py-2 pl-9 pr-3 text-sm`;

/* Oversized search field for hero sections (icon sits at left-4). */
export const inputLgIcon = `${control} py-3 pl-12 pr-4 text-base`;

/* Modal / command-palette search field: roomy like `inputLgIcon` but with
   padding on the right too, for the spinner / clear buttons. */
export const inputLgIconBoth = `${control} py-3 pl-12 pr-11 text-base`;

/* Native select — keeps the platform arrow, just matches the inputs. */
export const select = `${control} cursor-pointer px-3.5 py-2.5 pr-9 text-sm`;

/* Compact select for toolbars / filters. */
export const selectSm = `${control} cursor-pointer px-3 py-2 pr-8 text-sm`;

/* Compact select that hugs its content (card headers, toolbars). */
export const selectSmAuto = `${controlBase} w-auto cursor-pointer px-3 py-1.5 pr-8 text-sm`;

/* Compact select with a leading icon and custom chevron (appearance-none). */
export const selectSmIcon = `${controlBase} w-auto cursor-pointer appearance-none py-2 pl-9 pr-8 text-sm`;

/* Inline select rendered inside a table cell (compact, quiet surface).
   Self-contained on purpose: it is much shorter than the other controls, so
   it keeps the tighter `rounded-lg` radius. */
export const selectInline =
  'cursor-pointer rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-semibold ' +
  'text-slate-800 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 ' +
  'dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200';

/* Multi-line control. */
export const textarea = `${control} min-h-[96px] resize-y px-3.5 py-2.5 text-sm`;

/* Native checkbox. `accent-*` is what actually tints a native checkbox (the
   forms plugin is not installed), so it replaces the old no-op `text-blue-600`. */
export const checkbox =
  'h-4 w-4 cursor-pointer rounded border-slate-300 accent-blue-600 transition-colors ' +
  'focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:border-slate-600 dark:accent-blue-500';

/* Field label above a control. */
export const label = 'block text-sm font-medium text-slate-700 dark:text-slate-300';

/* Helper text below a control. */
export const hint = 'text-xs text-slate-500 dark:text-slate-400';

/* Inline validation message. */
export const fieldError = 'flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400';
