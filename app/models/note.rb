class Note < ActiveRecord::Base
  belongs_to :user
  attr_accessible :body, :subject

  def self.latest
    order('updated_at DESC').all
  end

  def subject_to_show
    subject = self['subject']
    if subject && subject != ''
      subject
    else
      body = self['body']
      body[0, body.index("\n")]
    end
  end
end
