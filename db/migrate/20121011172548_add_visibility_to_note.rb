class AddVisibilityToNote < ActiveRecord::Migration
  def change
    add_column :notes, :visibility, :integer, null: false, default: 2
  end
end
