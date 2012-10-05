class Note < ActiveRecord::Base
  belongs_to :user
  attr_accessible :body, :subject

  default_scope order: 'updated_at DESC'
  paginates_per 10

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
