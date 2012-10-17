class Note < ActiveRecord::Base
  belongs_to :user
  attr_accessible :body, :subject, :visibility, :format

  default_scope order: 'updated_at DESC'
  paginates_per 10

  VISIBILITY_PUBLIC = 2
  VISIBILITY_ANYONE = 1
  VISIBILITY_PRIVATE = 0

  FORMAT_MARKDOWN = 0
  FORMAT_TEXT = 1

  def self.public
    where("visibility = #{Note::VISIBILITY_PUBLIC}")
  end

  def subject_to_show
    subject = self[:subject]
    if subject && subject != ''
      subject
    else
      body = self[:body]
      body[0, body.index("\n")]
    end
  end

  def text?
    self[:format] == Note::FORMAT_TEXT
  end

  def format_slug
    case self[:format]
    when Note::FORMAT_TEXT
      'text'
    when Note::FORMAT_MARKDOWN
      'markdown'
    end
  end
end
