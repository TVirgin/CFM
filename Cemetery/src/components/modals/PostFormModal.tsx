import * as React from 'react';
import { PostFormData } from '@/pages/home/post.types'; // Adjust path
import { XCircle, Save } from 'lucide-react';

interface PostFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: PostFormData) => void;
  initialData?: PostFormData | null; // For editing
  isSaving: boolean;
}

export const PostFormModal: React.FC<PostFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSaving,
}) => {
  const [title, setTitle] = React.useState('');
  const [content, setContent] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState('');
  const [formError, setFormError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setContent(initialData.content || '');
      setImageUrl(initialData.imageUrl || '');
    } else {
      // Reset for create form
      setTitle('');
      setContent('');
      setImageUrl('');
    }
    setFormError(null);
  }, [initialData, isOpen]); // Reset form when initialData changes or modal opens

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setFormError('Title and Content are required.');
      return;
    }
    setFormError(null);
    onSubmit({ title, content, imageUrl });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg relative transform transition-all" onClick={e => e.stopPropagation()}>
        
        <h2 className="text-xl font-semibold mb-6 text-gray-800">
          {initialData ? 'Edit Post' : 'Create New Post'}
        </h2>

        {formError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm">
                <p>{formError}</p>
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="postTitle" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              id="postTitle"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              disabled={isSaving}
            />
          </div>
          <div>
            <label htmlFor="postContent" className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea
              id="postContent"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 bg-white border border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              disabled={isSaving}
            />
          </div>
          <div>
            <label htmlFor="postImageUrl" className="block text-sm font-medium text-gray-700 mb-1">Image URL (Optional)</label>
            <input
              id="postImageUrl"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="https://example.com/image.jpg"
              disabled={isSaving}
            />
          </div>
          <div className="pt-2 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 bg-white text-sm font-medium text-gray-700 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 border border-transparent rounded-md shadow-sm flex items-center disabled:bg-blue-300"
            >
              <Save size={16} className="mr-2" />
              {isSaving ? 'Saving...' : (initialData ? 'Save Changes' : 'Create Post')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};