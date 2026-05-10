import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../core/theme/appearance.dart';
import '../core/theme/telega_tokens.dart';
import '../presentation/providers/app_providers.dart';

class AppearanceScreen extends ConsumerWidget {
  const AppearanceScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final settings = ref.watch(appearanceProvider);
    final actions = ref.read(appearanceProvider.notifier);

    return Scaffold(
      appBar: AppBar(title: const Text('Appearance')),
      body: ListView(
        children: [
          _SectionHeader('Accent color'),
          _AccentPalette(
            current: settings.accent,
            onPick: actions.setAccent,
          ),
          const Divider(height: 1),
          _SectionHeader('Bubble style'),
          for (final style in BubbleStyle.values)
            _BubbleStyleTile(
              style: style,
              selected: settings.bubble == style,
              onTap: () => actions.setBubble(style),
            ),
          const Divider(height: 1),
          _SectionHeader('Density'),
          // RadioGroup حذف شد و مستقیماً Column با RadioListTile استفاده شده
          Column(
            children: [
              for (final density in Density.values)
                RadioListTile<Density>(
                  value: density,
                  groupValue: settings.density,
                  onChanged: (v) {
                    if (v != null) actions.setDensity(v);
                  },
                  title: Text(_densityLabel(density)),
                  subtitle: Text(_densitySubtitle(density)),
                ),
            ],
          ),
          const Divider(height: 1),
          _SectionHeader('Chat background'),
          _ChatBackgroundPalette(
            current: settings.chatBackground,
            onPick: actions.setChatBackground,
          ),
          const Divider(height: 1),
          _SectionHeader('Incoming bubble fill'),
          for (final fill in IncomingBubbleFill.values)
            _IncomingFillTile(
              fill: fill,
              selected: settings.incomingBubbleFill == fill,
              onTap: () => actions.setIncomingBubbleFill(fill),
            ),
        ],
      ),
    );
  }

  String _densityLabel(Density d) =>
      d == Density.comfortable ? 'Comfortable' : 'Compact';

  String _densitySubtitle(Density d) => d == Density.comfortable
      ? 'Airy spacing, larger avatars'
      : 'Tighter rows, smaller avatars';
}

// بقیه کلاس‌های کمکی (_SectionHeader, _AccentPalette, ...) بدون تغییر می‌مانند
// (برای اختصار تکرار نمی‌شوند، ولی در فایل اصلی همان‌ها را نگه دارید)
