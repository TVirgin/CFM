import * as React from 'react';
import { Post, User } from '@/types'; // Adjust path
import { Pencil } from 'lucide-react';

interface PostCardProps {
  post: Post;
  currentUser: User | null; // To check permissions for editing
  onEdit: (post: Post) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, currentUser, onEdit }) => {
  const canEdit = currentUser && (currentUser.role === 'admin' || currentUser.uid === post.authorId);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col transition-shadow duration-300 hover:shadow-2xl">
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-56 object-cover"
          onError={(e) => (e.currentTarget.style.display = 'none')} // Hide if image fails to load
        />
      )}
      <div className="p-6 flex flex-col flex-grow">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">{post.title}</h2>
        <p className="text-gray-700 text-base mb-4 line-clamp-4 flex-grow">{post.content}</p>
        <div className="mt-auto pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 mb-2">
            {post.authorName ? `By ${post.authorName}` : `Author ID: ${post.authorId}`}
          </div>
          <div className="text-xs text-gray-500">
            Posted on: {formatDate(post.createdAt)}
            {post.updatedAt && post.updatedAt !== post.createdAt && (
              <span className="italic"> (Edited: {formatDate(post.updatedAt)})</span>
            )}
          </div>
          {canEdit && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => onEdit(post)}
                className="p-2 text-sky-600 hover:text-sky-800 hover:bg-sky-100 rounded-full transition-colors duration-150"
                title="Edit Post"
              >
                <Pencil size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};