class Note < ActiveRecord::Base
  belongs_to :user
  attr_accessible :body, :subject, :visibility, :syntax

  default_scope order: 'updated_at DESC'
  paginates_per 10

  VISIBILITY_PUBLIC = 2
  VISIBILITY_ANYONE = 1
  VISIBILITY_PRIVATE = 0

  SYNTAX_MARKDOWN = 0
  SYNTAX_TEXT = 1
  SYNTAX_SJIS_ART = 2
	FORMAT_MARKDOWN = Note::SYNTAX_MARKDOWN

  def self.public
    where("visibility = #{Note::VISIBILITY_PUBLIC}")
  end

  def subject_to_show
    subject = self[:subject]
    if subject && subject != ''
      subject
    else
      body = self[:body]
      body[0, body.index("\n")].gsub(/#+\s+/, '')
    end
  end

  def text?
    self[:syntax] == Note::SYNTAX_TEXT
  end

  def sjis_art?
    self[:syntax] == Note::SYNTAX_SJIS_ART
  end

  def syntax_slug
    case self[:syntax]
    when Note::SYNTAX_TEXT
      'text'
    when Note::SYNTAX_SJIS_ART
      'sjis_art'
    when Note::SYNTAX_MARKDOWN
      'markdown'
    end
  end
end
