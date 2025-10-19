export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      announcements: {
        Row: {
          category: string | null
          content: string | null
          created_at: string | null
          description: string
          event_date: string | null
          event_time: string | null
          id: string
          image_url: string | null
          location: string | null
          media_type: string | null
          published: boolean | null
          title: string
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          category?: string | null
          content?: string | null
          created_at?: string | null
          description: string
          event_date?: string | null
          event_time?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          media_type?: string | null
          published?: boolean | null
          title: string
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          category?: string | null
          content?: string | null
          created_at?: string | null
          description?: string
          event_date?: string | null
          event_time?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          media_type?: string | null
          published?: boolean | null
          title?: string
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          category: string | null
          created_at: string | null
          description: string
          end_date: string | null
          event_time: string | null
          icon: string | null
          id: string
          image_url: string | null
          location: string
          media_type: string
          published: boolean | null
          start_date: string | null
          title: string
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description: string
          end_date?: string | null
          event_time?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          location: string
          media_type?: string
          published?: boolean | null
          start_date?: string | null
          title: string
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string
          end_date?: string | null
          event_time?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          location?: string
          media_type?: string
          published?: boolean | null
          start_date?: string | null
          title?: string
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      galleries: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          gallery_date: string | null
          id: string
          image_urls: string[]
          published: boolean | null
          section_id: string | null
          title: string
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          gallery_date?: string | null
          id?: string
          image_urls: string[]
          published?: boolean | null
          section_id?: string | null
          title: string
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          gallery_date?: string | null
          id?: string
          image_urls?: string[]
          published?: boolean | null
          section_id?: string | null
          title?: string
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "galleries_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "gallery_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      gallery_sections: {
        Row: {
          display_order: number
          id: string
          name: string
        }
        Insert: {
          display_order: number
          id?: string
          name: string
        }
        Update: {
          display_order?: number
          id?: string
          name?: string
        }
        Relationships: []
      }
      hero_sections: {
        Row: {
          created_at: string | null
          cta_link: string | null
          cta_text: string | null
          display_order: number | null
          id: string
          image_url: string
          published: boolean | null
          subtitle: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          cta_link?: string | null
          cta_text?: string | null
          display_order?: number | null
          id?: string
          image_url: string
          published?: boolean | null
          subtitle?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          cta_link?: string | null
          cta_text?: string | null
          display_order?: number | null
          id?: string
          image_url?: string
          published?: boolean | null
          subtitle?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      homepage_info: {
        Row: {
          content: string
          created_at: string | null
          display_order: number | null
          icon_name: string | null
          id: string
          published: boolean | null
          section_title: string
          updated_at: string | null
          welcome_video_url: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          display_order?: number | null
          icon_name?: string | null
          id?: string
          published?: boolean | null
          section_title: string
          updated_at?: string | null
          welcome_video_url?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          display_order?: number | null
          icon_name?: string | null
          id?: string
          published?: boolean | null
          section_title?: string
          updated_at?: string | null
          welcome_video_url?: string | null
        }
        Relationships: []
      }
      leaders: {
        Row: {
          bio: string | null
          contact: string | null
          created_at: string | null
          display_order: number | null
          id: string
          image_url: string | null
          ministry: string | null
          name: string
          published: boolean | null
          role: string
          updated_at: string | null
        }
        Insert: {
          bio?: string | null
          contact?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          ministry?: string | null
          name: string
          published?: boolean | null
          role: string
          updated_at?: string | null
        }
        Update: {
          bio?: string | null
          contact?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          ministry?: string | null
          name?: string
          published?: boolean | null
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      ministries: {
        Row: {
          age_group: string | null
          created_at: string | null
          description: string
          display_order: number | null
          icon_name: string | null
          id: string
          image_url: string | null
          leader_name: string | null
          long_description: string | null
          published: boolean | null
          schedule: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          age_group?: string | null
          created_at?: string | null
          description: string
          display_order?: number | null
          icon_name?: string | null
          id?: string
          image_url?: string | null
          leader_name?: string | null
          long_description?: string | null
          published?: boolean | null
          schedule?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          age_group?: string | null
          created_at?: string | null
          description?: string
          display_order?: number | null
          icon_name?: string | null
          id?: string
          image_url?: string | null
          leader_name?: string | null
          long_description?: string | null
          published?: boolean | null
          schedule?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      notice_board: {
        Row: {
          content: string | null
          created_at: string | null
          description: string
          display_order: number | null
          id: string
          image_url: string | null
          media_type: string | null
          media_url: string | null
          published: boolean | null
          title: string
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          description: string
          display_order?: number | null
          id?: string
          image_url?: string | null
          media_type?: string | null
          media_url?: string | null
          published?: boolean | null
          title: string
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          description?: string
          display_order?: number | null
          id?: string
          image_url?: string | null
          media_type?: string | null
          media_url?: string | null
          published?: boolean | null
          title?: string
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      welcome_section: {
        Row: {
          content: string
          created_at: string | null
          display_order: number | null
          id: string
          published: boolean | null
          title: string
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          published?: boolean | null
          title: string
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          published?: boolean | null
          title?: string
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
