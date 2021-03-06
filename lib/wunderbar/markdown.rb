require 'wunderbar'
require 'kramdown'
require 'nokogiri'
require 'sanitize'

module Wunderbar
  class HtmlMarkup
    def _markdown(string)
      _{ Kramdown::Document.new(CDATANode.normalize(string)).to_html }
    end
  end
end
