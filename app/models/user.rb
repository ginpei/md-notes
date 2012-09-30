class User < ActiveRecord::Base
  attr_accessible :account, :image_url, :provider, :provider_uid
end
