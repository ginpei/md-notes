class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :account
      t.string :image_url
      t.string :provider
      t.string :provider_uid

      t.timestamps
    end
  end
end
