class MiscellaneousController < ApplicationController
  def home
    @notes = Note.public.page params[:page]
  end

  def about
  end
end
