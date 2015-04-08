var CommentBox = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  loadCommentsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
    //setInterval(this.loadCommentsFromServer, this.props.pollIntervall);
  },
  handleCommentSubmit: function(comment) {
    var comments = this.state.data;
    var newComments = [comment].concat(comments);
    this.setState({data: newComments});
    $.ajax({
      url: this.props.createUrl,
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: function(data) {
        //this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div className="commentBox row">
        <div className="col-xs-6">
          <CommentList data={this.state.data} />
        </div>
        <div className="col-xs-6">
          <CommentForm onCommentSubmit={this.handleCommentSubmit} />
        </div>
      </div>
    );
  }
});

var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function(comment) {
      return (
        <Comment key={comment.id} author={comment.author}
          createdAt={comment.createdAt}>
          {comment.text}
        </Comment>
      );
    });
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});

var CommentForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var author = React.findDOMNode(this.refs.author).value.trim();
    var comment = React.findDOMNode(this.refs.text).value.trim();
    var timestamp = moment().format();
    if (!comment || !author) {
      return;
    }
    this.props.onCommentSubmit({author: author, text: comment,
                               createdAt: timestamp});
    React.findDOMNode(this.refs.author).value = '';
    React.findDOMNode(this.refs.text).value = '';
    React.findDOMNode(this.refs.author).focus();
    return;
  },
  render: function() {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <div className="form-group">
          <input className="form-control" type="text" placeholder="Your name"
            ref="author" autoFocus="true" />
        </div>
        <div className="form-group">
          <input className="form-control" type="text" placeholder="Your comment"
            ref="text" />
        </div>
        <input className="btn btn-success" type="submit" value="Post Comment" />
      </form>
    );
  }
});

var converter = new Showdown.converter();
var Comment = React.createClass({
  render: function() {
    var rawMarkup = converter.makeHtml(this.props.children.toString());
    var timeAgo = moment(this.props.createdAt).fromNow();
    return (
      <div className="comment">
        <div className="commentAuthor">
          {this.props.author} - {timeAgo}
        </div>
        <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
      </div>
    );
  }
});

//React.render(
  //<CommentBox url="comments.json" pollIntervall={2000}/>,
  //document.getElementById('content')
//);
