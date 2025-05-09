// src/components/modals/ReauthenticationModal.tsx
import * as React from 'react';
import { XCircle, ShieldCheck } from 'lucide-react';

interface ReauthenticationModalProps {
  isOpen: boolean;
  onClose: () => void;
  /**
   * Callback function that receives the entered email and password.
   * The parent component is responsible for calling Firebase's
   * reauthenticateWithCredential method with these credentials.
   */
  onConfirm: (email: string, password: string) => Promise<void>;
  actionName: string; // Describes the action requiring re-authentication (e.g., "create this post", "save these changes")
  isProcessing: boolean; // True if re-authentication or the subsequent action is in progress
  error: string | null; // Error message to display, if any
  defaultEmail?: string; // Optional default email to pre-fill the email input
}

export const ReauthenticationModal: React.FC<ReauthenticationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  actionName,
  isProcessing,
  error,
  defaultEmail = ''
}) => {
  const [email, setEmail] = React.useState(defaultEmail);
  const [password, setPassword] = React.useState('');

  // Effect to reset form when modal opens or defaultEmail changes
  React.useEffect(() => {
    if (isOpen) {
      setEmail(defaultEmail);
      setPassword(''); // Always clear password when modal opens
    }
  }, [isOpen, defaultEmail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
        // This basic validation can be enhanced. For now, an alert.
        // In a real app, you might set a local form error state.
        alert("Email and password are required.");
        return;
    }
    await onConfirm(email, password);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 transition-opacity duration-300 ease-in-out"
      aria-labelledby="reauth-modal-title"
      role="dialog"
      aria-modal="true"
      onClick={isProcessing ? undefined : onClose} // Prevent closing by backdrop click if processing
    >
      <div
        className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 ease-in-out scale-100 relative"
        onClick={e => e.stopPropagation()} // Prevent backdrop click from closing when clicking modal content
      >
        <button
          onClick={onClose}
          disabled={isProcessing}
          className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 disabled:opacity-50"
          aria-label="Close modal"
        >
          <XCircle size={24} />
        </button>

        <div className="flex items-center mb-5">
            <ShieldCheck className="h-8 w-8 text-blue-600 mr-3 flex-shrink-0" />
            <h2 className="text-xl font-semibold text-gray-800" id="reauth-modal-title">
              Re-authentication Required
            </h2>
        </div>

        <p className="text-sm text-gray-600 mb-5">
          For your security, please enter your current email and password to confirm you want to {actionName.toLowerCase()}.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm" role="alert">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="reauthModalEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="reauthModalEmail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100"
              required
              disabled={isProcessing}
              autoComplete="email"
            />
          </div>
          <div>
            <label htmlFor="reauthModalPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="reauthModalPassword"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100"
              required
              disabled={isProcessing}
              autoComplete="current-password"
            />
          </div>
          <div className="pt-3 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="w-full sm:w-auto inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full sm:w-auto inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:opacity-75"
            >
              {isProcessing ? 'Verifying...' : 'Confirm & Proceed'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// If you prefer default export for components:
// export default ReauthenticationModal;
// Otherwise, the named export `export const ReauthenticationModal` is perfectly fine.