class User < ActiveRecord::Base
  attr_accessible :account, :image_url, :provider, :provider_uid

  def self.create_with_auth(auth)
    create! do |user|
      user.provider = auth['provider']
      user.provider_uid = auth['uid']

      info = auth['info']
      user.account = info['nickname']
      user.image_url = info['image']
    end
  end
end
