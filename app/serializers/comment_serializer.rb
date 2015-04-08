class CommentSerializer < ActiveModel::Serializer
  attributes :id, :author, :text, :created_at
end
