class RenameColumnTitle < ActiveRecord::Migration
  def change
    rename_column :notes, :title, :subject
  end
end
