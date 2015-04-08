class CommentsController < ApplicationController
  def index
    @comments = Comment.order('id desc')
    render json: @comments
  end

  def create
    comment = Comment.new(author: params[:author], text: params[:text])
    if comment.save
      @comments = Comment.order('id desc')
      render json: @comments
    else
      render json: comment.errors.messages, status: :unprocessable_entity
    end
  end
end
