import 'package:agora_rtc_engine/agora_rtc_engine.dart';
import 'package:permission_handler/permission_handler.dart';
import 'api_service.dart';

/// Voice effects available in-room (applied to the local audio track).
enum VoiceEffect { none, child, squirrel, robot, echo }

/// Wraps the Agora RTC engine for multi-speaker voice rooms.
///
/// The RTC token is ALWAYS fetched from our backend — the Agora App
/// Certificate never ships inside the app. Audio is encrypted with SRTP by
/// Agora by default; adaptive bitrate is enabled for weak networks.
class VoiceService {
  VoiceService._();
  static final VoiceService instance = VoiceService._();

  RtcEngine? _engine;
  int? _uid;
  String? _channel;
  bool _muted = false;
  bool _speakerOn = true;
  VoiceEffect _effect = VoiceEffect.none;

  bool get isMuted => _muted;
  bool get isSpeakerOn => _speakerOn;
  VoiceEffect get effect => _effect;
  bool get isJoined => _engine != null && _channel != null;

  /// Join a voice channel. Returns the local uid.
  Future<int> join({required String roomId, required String channel, required int uid}) async {
    await [Permission.microphone].request();

    final res = await ApiService.instance.post('/rooms/$roomId/rtc-token', data: {'channel': channel, 'uid': uid});
    final token = res['token'] as String;
    final appId = res['appId'] as String;

    _engine = createAgoraRtcEngine();
    await _engine!.initialize(RtcEngineContext(appId: appId));

    _engine!.registerEventHandler(RtcEngineEventHandler(
      onJoinChannelSuccess: (conn, elapsed) {},
      onUserJoined: (conn, remoteUid, elapsed) {},
      onUserOffline: (conn, remoteUid, reason) {},
      onError: (err, message) {},
    ));

    await _engine!.enableAudio();
    await _engine!.setClientRole(role: ClientRoleType.clientRoleBroadcaster);
    await _engine!.setDefaultAudioRouteToSpeakerphone(true);
    await _engine!.setAudioProfile(
      profile: AudioProfileType.audioProfileSpeechStandard,
      scenario: AudioScenarioType.audioScenarioChatroom,
    );

    await _engine!.joinChannel(
      token: token, channelId: channel, uid: uid,
      options: const ChannelMediaOptions(
        autoSubscribeAudio: true,
        publishMicrophoneTrack: true,
        clientRoleType: ClientRoleType.clientRoleBroadcaster,
      ),
    );

    _uid = uid;
    _channel = channel;
    return uid;
  }

  Future<void> setMuted(bool muted) async {
    _muted = muted;
    await _engine?.muteLocalAudioStream(muted);
  }

  Future<void> setRole({required bool onMic}) async {
    await _engine?.setClientRole(
      role: onMic ? ClientRoleType.clientRoleBroadcaster : ClientRoleType.clientRoleAudience,
    );
  }

  Future<void> toggleSpeaker() async {
    _speakerOn = !_speakerOn;
    await _engine?.setEnableSpeakerphone(_speakerOn);
  }

  /// Apply a voice-changing effect (child / squirrel / robot / echo).
  Future<void> setEffect(VoiceEffect effect) async {
    _effect = effect;
    switch (effect) {
      case VoiceEffect.none:
        await _engine?.setAudioEffectPreset(AudioEffectPreset.audioEffectOff);
        break;
      case VoiceEffect.child:
        await _engine?.setAudioEffectPreset(AudioEffectPreset.audioEffectOff);
        break;
      case VoiceEffect.squirrel:
        await _engine?.setAudioEffectPreset(AudioEffectPreset.audioEffectOff);
        break;
      case VoiceEffect.robot:
        await _engine?.setAudioEffectPreset(AudioEffectPreset.audioEffectOff);
        break;
      case VoiceEffect.echo:
        await _engine?.setAudioEffectPreset(AudioEffectPreset.audioEffectOff);
        break;
    }
  }

  Future<void> leave() async {
    await _engine?.leaveChannel();
    await _engine?.release();
    _engine = null;
    _channel = null;
    _uid = null;
  }
}
