class Linepush < Apicommon
  # require 'net/http'
  # require 'uri'
  # require 'json' 
  @@url = 'https://api.line.me/v2/bot/message/broadcast'

  def initialize()
    @uri = URI.parse(@@url)
    @http = Net::HTTP.new(@uri.host,@uri.port)
    @http.use_ssl = true
  end

  # def setToken(token)
  #   @token = token
  # end

  def setTitle(title)
    @title = title
  end

  def setBody(body)
    @body = body
  end

  def setImage(image)
    @image = image
  end

  def doPushMsg
    # メッセージ部分作成
    send_message = @title + "\n" + @body
    params = {"messages" => [{"type" => "text", "text" => send_message}]}
    doPush(params)
  end

  def doPushImg
    paramsImg = {"messages" => [{"type" => "image", "originalContentUrl" => @image.image.to_s, 'previewImageUrl' => @image.image.to_s}]}
    doPush(paramsImg)
  end

  private
    def getHeader
      headers = {
        'Authorization'=>"Bearer #{@token}",
        'Content-Type' =>'application/json',
        'Accept'=>'application/json'
      }
      return headers
    end

    def doPush(jsonParam)
      response = @http.post(@uri.path, jsonParam.to_json, getHeader())
    end
end