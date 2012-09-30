class ApplicationController < ActionController::Base
  protect_from_forgery

  helper_method :signin_path
  helper_method :current_user

  private

  def signin_path(provider)
    "#{root_path}auth/#{provider}"
  end

  def current_user
    @current_user ||= User.find(session[:user_id]) if session[:user_id]
  end
end
