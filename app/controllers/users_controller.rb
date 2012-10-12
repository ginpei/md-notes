class UsersController < ApplicationController
  # GET /user_name
  # GET /user_name.json
  def show
    @user = User.find_by_account(params[:id])
    if @user == current_user
      @notes = @user.notes.page params[:page]
    else
      @notes = @user.notes.public.page params[:page]
    end

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @user }
    end
  end

=begin
  # GET /users/1/edit
  def edit
    @user = User.find(params[:id])
  end

  # PUT /users/1
  # PUT /users/1.json
  def update
    @user = User.find(params[:id])

    respond_to do |format|
      if @user.update_attributes(params[:user])
        format.html { redirect_to @user, notice: 'User was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /users/1
  # DELETE /users/1.json
  def destroy
    @user = User.find(params[:id])
    @user.destroy

    respond_to do |format|
      format.html { redirect_to users_url }
      format.json { head :no_content }
    end
  end
=end
end
