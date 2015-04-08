class Comment < ActiveRecord::Base
  validates :text, presence: true
  validates :author, presence: true

  after_create :prune

  # Prune comments after it reaches a certain size
  # to prevent database spam.
  def prune
    if Comment.count > 15
      comment = Comment.order('id asc').first
      comment.destroy
    end
  end
end
