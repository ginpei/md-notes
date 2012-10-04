class MiscellaneousController < ApplicationController
  def home
    @notes = Note.latest
  end
end
