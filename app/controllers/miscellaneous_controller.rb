class MiscellaneousController < ApplicationController
  def home
    @notes = Note.page params[:page]
  end
end
