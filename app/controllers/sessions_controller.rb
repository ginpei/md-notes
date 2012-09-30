class SessionsController < ApplicationController
  def callback
    auth = request.env['omniauth.auth']
    user = User.find_by_provider_and_provider_uid(auth['provider'], auth['uid'])
    unless user
      user = User.create_with_auth(auth)
    end
    session[:user_id] = user.id
    redirect_to root_url, notice: 'Signed in.'
  end

  def sign_out
    session[:user_id] = nil
    redirect_to root_url, notice: 'Signed out.'
  end
end
