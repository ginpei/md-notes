class Note < ActiveRecord::Base
  belongs_to :user
  attr_accessible :body, :title

  def self.latest
    order('updated_at DESC').all
  end
end
