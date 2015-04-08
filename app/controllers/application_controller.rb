class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  before_filter :snake_case_params!

  # Disable root node for serialized models
  #
  def default_serializer_options
    { root: false }
  end

  # Convert camel case back to snake case
  #
  def snake_case_params!(val = params)
    case val
    when Array
      val.map { |v| deep_snake_case_params! v }
    when Hash
      val.keys.each do |k, v = val[k]|
        val.delete k
        val[k.underscore] = snake_case_params!(v)
      end
      val
    else
      val
    end
  end
end
