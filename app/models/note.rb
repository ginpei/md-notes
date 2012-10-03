class Note < ActiveRecord::Base
  belongs_to :user
  attr_accessible :body, :title

  def self.latest
    order('updated_at DESC').all
  end

  def title_to_show
    title = self['title']
    if title && title != ''
      title
    else
      body = self['body']
      body[0, body.index("\n")]
    end
  end
end
