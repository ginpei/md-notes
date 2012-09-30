class CreateNotes < ActiveRecord::Migration
  def change
    create_table :notes do |t|
      t.references :user, null: false
      t.string :title, null: false
      t.text :body, null: false

      t.timestamps
    end
    add_index :notes, :user_id
  end
end
