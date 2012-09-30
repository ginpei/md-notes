class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :account, null: false
      t.string :image_url, null: false
      t.string :provider, null: false
      t.string :provider_uid, null: false

      t.timestamps
    end

    add_index :users, :account, unique: true
    add_index :users, [:provider, :provider_uid], unique: true
  end
end
