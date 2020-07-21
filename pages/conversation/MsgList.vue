<template>
  <div class="warpper" style="height:80vh; overflow-y: scroll; padding:1em">
    <div class=" title text-xl">chatform 111</div>

    <div class="bubble-dialog">
      <div class="bubble-right"><p>ortor, s</p></div>
      <div class="bubble-left"><p>ere ut aliquet non, aucto</p></div>
      <div class="bubble-right"><p>at a. Sed conv</p></div>
      <div class="bubble-left">
        <p>
          em ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque in
          libero ultrices, porta elit quis, pretium purus. Vivamus vel sapien
          risus. Phasellus a leo sit amet lectus tempor pellentesque.
          Pellentesque mollis et est ac faucibus. Vestibulum ante ipsum primis
          in faucibus orci
        </p>
      </div>
      <div class="bubble-right">
        <p>
          liquam et odio nulla. Nullam convallis erat scelerisque dui rhoncus,
          volutpat sodales lorem cursus. Duis eget laoreet orci. Mauris vel
          velit sapien. Donec ullamcorper vestibulum enim, sed mattis eros
          bibendum et...
        </p>
      </div>
      <div class="bubble-left">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
          in libero ultrices, porta elit quis, pretium purus. Vivamus vel sapien
          risus. Phasellus a leo sit amet lectus tempor pellentesque.
        </p>
      </div>
      <div class="bubble-right">
        <p>am at dolor egestas pulvinar. Vivamur...</p>
      </div>
      <div class="bubble-left">
        <p>
          eo nisi, interdum ac pellentesque et, ornare id sapien. Nullam viverra
          est metus, ac semper turpis euismod nec. Nam dignissim leo et tellus
          viverra condimentum. In nunc lacus, ultrices rhoncus tortor eu,
          pulvinar pulvinar massa. Curabitur at era
        </p>
      </div>
      <div class="bubble-right">
        <p><em>Nullam porta gravida ante ut tristique.</em></p>
      </div>
      <div class="bubble-left"><p>nisl. Aliquam et odio nul</p></div>
      <div class="bubble-right"><p>"Curabitur".</p></div>
      <div class="bubble-left"><p>sollicitudin.</p></div>
      <div class="bubble-right">
        <p>Duis convallis nulla vitae sem accumsan ornare. Nam i</p>
      </div>
      <div class="bubble-left">
        <p>
          Suspendisse quis fermentum nisi. Maecenas leo nisi, interdum ac
          pellentesque et, ornare id sapien. Nullam viverra est metus, ac semper
          turpis euismod nec. Nam dignissim leo et tellus viverra condimentum.
          In nunc lacus, ultrices rhoncus tortor eu, pulvinar pulvinar massa.
          Curabitur at erat sem. Suspendisse dignissim urna ac elit rutrum
          dignissim
        </p>
      </div>
      <div class="bubble-right">
        <p>uet non, auctor nec nisl. Aliquam et o</p>
      </div>
      <div class="bubble-left"><p>Y tempus, orci urna ?</p></div>
      <div class="bubble-right"><p>est ac v.</p></div>
      <div class="bubble-left">
        <p>Quisque mollis quam maximus purus placerat vehicula.</p>
      </div>
      <div class="bubble-right">
        <p>
          corper dui augue, ac finibus ante laoreet vel. Nullam porta gravida
          ante ut tristique. Proin viverra sapien ut magna sodales, non egestas
          nibh eleifend. Su
        </p>
      </div>
      <div class="bubble-left">
        <p>
          Duis convallis nulla vitae sem accumsan ornare. Nam in elit a lectus
          fermentum dapibus vel eget augue. Nullam lobortis maximus dui, nec
          bibendum eros dapibus id. Nulla sit amet turpis
        </p>
      </div>
      <div class="bubble-right">
        <p>
          utrum massa vitae, semper sapien. Nulla quis lobortis justo. Ut vitae
          quam at dolor egestas pulvinar. Vivamus congue ultricies ex et
          fringilla.
        </p>
      </div>
      <div class="bubble-left"><p>e eu quam finibus, iaculis</p></div>
      <div class="bubble-right"><p>"bibendum".</p></div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'MsgList'
}
</script>

<style scoped>
.bubble-dialog {
  white-space: pre-line;
  line-height: 0;
}

.bubble-left,
.bubble-right {
  line-height: 100%;
  display: block;
  position: relative;
  padding: 0.25em 0.5em;
  background: pink;
  border: red solid 3px;
  -webkit-border-radius: 11px;
  -moz-border-radius: 11px;
  border-radius: 11px;
  margin-bottom: 2em;
  clear: both;
  max-width: 50%;
}
p {
  margin-bottom: 0;
  padding: 1em;
}

.bubble-left {
  float: left;
  margin-right: 10%;
}
.bubble-right {
  float: right;
  margin-left: 10%;
}

.bubble-left:after,
.bubble-left:before,
.bubble-right:after,
.bubble-right:before {
  content: '';
  position: absolute;
  top: 21px;
  border-style: solid;
  border-width: 13px 17px 13px 0;
  border-color: transparent pink;
  display: block;
  width: 0;
}

.bubble-left:after,
.bubble-left:before {
  border-width: 13px 17px 13px 0;
  border-color: transparent pink;
}

.bubble-right:after,
.bubble-right:before {
  border-width: 13px 0 13px 17px;
  border-color: transparent pink;
}

.bubble-left:after {
  left: -16px;
  border-color: transparent pink;
  z-index: 1;
}

.bubble-left:before {
  left: -19px;
  border-color: transparent red;
  z-index: 0;
}

.bubble-right:after {
  right: -16px;
  border-color: transparent pink;
  z-index: 1;
}

.bubble-right:before {
  right: -19px;
  border-color: transparent red;
  z-index: 0;
}
</style>
